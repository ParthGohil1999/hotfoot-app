import { CactusOAICompatibleMessage, CompletionParams, ContextParams, LlamaContext, NativeCompletionResult, TokenData, initLlama } from 'cactus-react-native';

interface Parameter {
    // name: string,
    type: string,
    description: string,
    required?: boolean, // parameter is optional if not specified
    enum?: string[]
}

interface Tool {
    func: Function,
    description: string,
    parameters: {[name: string]: Parameter},
    required: string[]
}

export class Tools {
    private tools = new Map<string, Tool>();
    
    add(
        func: Function, 
        description: string,
        parameters: {[name: string]: Parameter},
      ) {
        this.tools.set(func.name, { 
          func, 
          description,
          parameters,
          required: Object.entries(parameters)
            .filter(([_, param]) => param.required)
            .map(([name, _]) => name)
        });
        return func;
      }
    
    getSchemas() {
        return Array.from(this.tools.entries()).map(([name, { description, parameters, required }]) => ({
          type: "function",
          function: {
            name,
            description,
            parameters: {
              type: "object",
              properties: parameters,
              required
            }
          }
        }));
      }
    
    async execute(name: string, args: any) {
        const tool = this.tools.get(name);
        if (!tool) throw new Error(`Tool ${name} not found`);
        return await tool.func(...Object.values(args));
    }
}

export async function parseAndExecuteTool(result: NativeCompletionResult, tools: Tools): Promise<{toolCalled: boolean, toolName?: string, toolInput?: any, toolOutput?: any}> {
    if (!result.tool_calls || result.tool_calls.length === 0) {
        console.log('No tool calls found');
        return {toolCalled: false};
    }
    
    try {
        const toolCall = result.tool_calls[0];
        const toolName = toolCall.function.name;
        const toolInput = JSON.parse(toolCall.function.arguments);
        
        console.log('Calling tool:', toolName, toolInput);
        const toolOutput = await tools.execute(toolName, toolInput);
        console.log('Tool called result:', toolOutput);
        
        return {
            toolCalled: true,
            toolName,
            toolInput,
            toolOutput
        };
    } catch (error) {
        console.error('Error parsing tool call:', error);
        return {toolCalled: false};
    }
}

export class TestLlamaContext extends LlamaContext {

    async completionWithAutoToolCall(
        params: CompletionParams & {tools: Tools},
        callback?: (data: TokenData) => void,
        recursionCount: number = 0,
        recursionLimit: number = 3
    ): Promise<NativeCompletionResult> {
        if (!params.messages) { // tool calling only works with messages
            return super.completion(params, callback);
        }
        if (!params.tools) { // no tools => default completion
            return super.completion(params, callback);
        }
        if (recursionCount >= recursionLimit) {
            console.log(`Recursion limit reached (${recursionCount}/${recursionLimit}), returning default completion`)
            return super.completion({
                ...params,
                jinja: true, 
                tools: params.tools.getSchemas()
            }, callback);
        }

        const messages = [...params.messages]; // avoid mutating the original messages

        console.log('Calling completion...')
        const result = await super.completion({
            ...params, 
            messages: messages,
            jinja: true, 
            tools: params.tools.getSchemas()
        }, callback);
        console.log('Completion result:', result);
        
        const {toolCalled, toolName, toolInput, toolOutput} = 
            await parseAndExecuteTool(result, params.tools);

        if (toolCalled && toolName && toolInput) {
            const assistantMessage = {
                role: 'assistant',
                content: result.content,
                tool_calls: result.tool_calls
            } as CactusOAICompatibleMessage;

            messages.push(assistantMessage);
            
            const toolCallId = result.tool_calls?.[0]?.id;
            const toolMessage = {
                role: 'tool',
                content: JSON.stringify(toolOutput),
                tool_call_id: toolCallId
            } as CactusOAICompatibleMessage;
            
            messages.push(toolMessage);
            
            console.log('Messages being sent to next completion:', JSON.stringify(messages, null, 2));
            
            return await this.completionWithAutoToolCall(
                {...params, messages: messages}, 
                callback, 
                recursionCount + 1, 
                recursionLimit
            );
        }

        return result;
    }
}

export async function testInitLlama(params: ContextParams) {
    const context = await initLlama(params);
    const testContext = Object.create(TestLlamaContext.prototype);
    Object.assign(testContext, context);
    return testContext;
}