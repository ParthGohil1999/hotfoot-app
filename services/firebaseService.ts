import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, orderBy, where, limit } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { Agent, Tool, PublishedItem } from '../types/agents';

export class FirebaseService {
    // Agents
    static async publishAgent(agent: Agent, authorName: string, authorEmail: string): Promise<void> {
        try {
            const agentData = {
                ...agent,
                authorName,
                authorEmail,
                isPublished: true,
                downloads: 0,
                rating: 0,
                publishedAt: new Date()
            };

            await addDoc(collection(db, 'publishedAgents'), agentData);
        } catch (error) {
            console.error('Error publishing agent:', error);
            throw error;
        }
    }

    static async getPublishedAgents(): Promise<PublishedItem[]> {
        try {
            // Simplified query without compound where clauses
            const q = query(
                collection(db, 'publishedAgents'),
                orderBy('createdAt', 'desc'),
                limit(50)
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt) || new Date(),
                    publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate() : new Date(data.publishedAt) || new Date(),
                    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt) || new Date()
                };
            }).filter(item => !item.isArchived) as PublishedItem[]; // Client-side filtering
        } catch (error) {
            console.error('Error getting published agents:', error);
            return [];
        }
    }

    static async getMyPublishedAgents(authorEmail: string): Promise<PublishedItem[]> {
        try {
            // Simple query with just authorEmail filter
            const q = query(
                collection(db, 'publishedAgents'),
                where('authorEmail', '==', authorEmail),
                limit(50)
            );

            const querySnapshot = await getDocs(q);
            const agents = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt) || new Date(),
                    publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate() : new Date(data.publishedAt) || new Date(),
                    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt) || new Date()
                };
            }).filter(item => !item.isArchived) as PublishedItem[]; // Client-side filtering

            // Sort on client side
            return agents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        } catch (error) {
            console.error('Error getting my published agents:', error);
            return [];
        }
    }

    static async getAgentDetails(agentId: string): Promise<Agent | null> {
        try {
            const docRef = doc(db, 'publishedAgents', agentId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                return {
                    ...data,
                    id: docSnap.id,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date()
                } as Agent;
            }
            return null;
        } catch (error) {
            console.error('Error getting agent details:', error);
            return null;
        }
    }

    // Tools
    static async publishTool(
        toolsInput: Tool | Tool[],
        authorName: string,
        authorEmail: string
    ): Promise<void> {
        try {
            const tools = Array.isArray(toolsInput) ? toolsInput : [toolsInput];
            console.log(`🚀 Starting publishTools for ${authorEmail}, count: ${tools.length}`);

            // Fetch user's tools to build ID mapping
            const [publishedTools, archivedTools] = await Promise.all([
                this.getMyPublishedTools(authorEmail),
                this.getArchivedTools(authorEmail)
            ]);

            const allTools = [...publishedTools, ...archivedTools];

            const idMapping = new Map<string, string>(); // key: tool.id or dataId, value: Firestore doc ID
            allTools.forEach(existingTool => {
                idMapping.set(existingTool.id, existingTool.firestoreId || existingTool.id);
                if (existingTool.dataId && existingTool.dataId !== existingTool.id) {
                    idMapping.set(existingTool.dataId, existingTool.firestoreId || existingTool.id);
                }
            });

            // Process tools
            const operations = tools.map(async (tool, index) => {
                const matchingFirestoreId = idMapping.get(tool.id) || idMapping.get(tool.dataId);
                const toolData = {
                    ...tool,
                    authorName,
                    authorEmail,
                    isPublished: true,
                    isArchived: false,
                    downloads: 0,
                    rating: 0,
                    publishedAt: new Date(),
                    updatedAt: new Date()
                };

                if (matchingFirestoreId) {
                    const docRef = doc(db, 'publishedTools', matchingFirestoreId);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const existingTool = docSnap.data();
                        if (existingTool.authorEmail === authorEmail) {
                            // 🔄 Update existing tool
                            await updateDoc(docRef, toolData);
                            console.log(`🔄 Updated tool ${index + 1}/${tools.length}: ${tool.name}`);
                            return;
                        }
                    }
                }

                // ✅ New tool (or trying to publish another user's tool)
                // ➕ Generate a unique ID to avoid duplication
                const uniqueToolData = {
                    ...toolData,
                    id: `${tool.id}-${Date.now()}`
                };

                await addDoc(collection(db, 'publishedTools'), uniqueToolData);
                console.log(`✅ Created new tool ${index + 1}/${tools.length}: ${tool.name}`);
            });

            await Promise.all(operations);
            console.log(`🎉 All tools published or updated for ${authorEmail}`);
        } catch (error) {
            console.error('❌ Error in publishTools:', error);
            throw error;
        }
    }



    static async getPublishedTools(): Promise<PublishedItem[]> {
        try {
            // Simplified query without compound where clauses
            const q = query(
                collection(db, 'publishedTools'),
                orderBy('createdAt', 'desc'),
                limit(50)
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt) || new Date(),
                    publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate() : new Date(data.publishedAt) || new Date(),
                    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt) || new Date()
                };
            }).filter(item => !item.isArchived) as PublishedItem[]; // Client-side filtering
        } catch (error) {
            console.error('Error getting published tools:', error);
            return [];
        }
    }

    static async getMyPublishedTools(authorEmail: string): Promise<PublishedItem[]> {
        try {
            console.log('🔍 DEBUG: Getting tools for email:', authorEmail);

            // Simple query with just authorEmail filter
            const q = query(
                collection(db, 'publishedTools'),
                where('authorEmail', '==', authorEmail),
                limit(50)
            );

            const querySnapshot = await getDocs(q);
            console.log('🔍 DEBUG: Query returned', querySnapshot.docs.length, 'documents');

            const tools = querySnapshot.docs.map(doc => {
                const data = doc.data();
                console.log('🔍 DEBUG: Processing doc:', {
                    firestoreId: doc.id,
                    dataId: data.id,
                    name: data.name,
                    isArchived: data.isArchived,
                    authorEmail: data.authorEmail
                });

                return {
                    id: doc.id, // Use Firestore document ID, not data.id
                    firestoreId: doc.id, // Keep track of both
                    dataId: data.id, // The original ID from the data
                    ...data,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt) || new Date(),
                    publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate() : new Date(data.publishedAt) || new Date(),
                    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt) || new Date()
                };
            }).filter(item => !item.isArchived) as PublishedItem[]; // Client-side filtering

            console.log('🔍 DEBUG: Final tools array:', tools.map(t => ({
                id: t.id,
                firestoreId: t.firestoreId,
                dataId: t.dataId,
                name: t.name
            })));

            // Sort on client side
            return tools.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        } catch (error) {
            console.error('Error getting my published tools:', error);
            return [];
        }
    }

    static async getArchivedTools(authorEmail: string): Promise<PublishedItem[]> {
        try {
            console.log('🔍 DEBUG: Getting archived tools for email:', authorEmail);

            // Simple query with just authorEmail filter
            const q = query(
                collection(db, 'publishedTools'),
                where('authorEmail', '==', authorEmail),
                limit(50)
            );

            const querySnapshot = await getDocs(q);
            console.log('🔍 DEBUG: Query returned', querySnapshot.docs.length, 'documents');

            const tools = querySnapshot.docs.map(doc => {
                const data = doc.data();
                console.log('🔍 DEBUG: Processing archived doc:', {
                    firestoreId: doc.id,
                    dataId: data.id,
                    name: data.name,
                    isArchived: data.isArchived,
                    authorEmail: data.authorEmail
                });

                return {
                    id: doc.id, // Use Firestore document ID, not data.id
                    firestoreId: doc.id, // Keep track of both
                    dataId: data.id, // The original ID from the data
                    ...data,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt) || new Date(),
                    publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate() : new Date(data.publishedAt) || new Date(),
                    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt) || new Date(),
                    archivedAt: data.archivedAt?.toDate ? data.archivedAt.toDate() : new Date(data.archivedAt) || new Date()
                };
            }).filter(item => item.isArchived) as PublishedItem[]; // Client-side filtering

            console.log('🔍 DEBUG: Final archived tools array:', tools.map(t => ({
                id: t.id,
                firestoreId: t.firestoreId,
                dataId: t.dataId,
                name: t.name,
                isArchived: t.isArchived
            })));

            return tools.sort((a, b) => (b.archivedAt?.getTime() || 0) - (a.archivedAt?.getTime() || 0));
        } catch (error) {
            console.error('Error getting archived tools:', error);
            return [];
        }
    }

    static async getToolDetails(toolId: string): Promise<Tool | null> {
        try {
            const docRef = doc(db, 'publishedTools', toolId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                return {
                    ...data,
                    id: docSnap.id,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date()
                } as Tool;
            }
            return null;
        } catch (error) {
            console.error('Error getting tool details:', error);
            return null;
        }
    }

    static async incrementDownloadCount(collectionName: string, itemId: string): Promise<void> {
        try {
            const docRef = doc(db, collectionName, itemId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const currentDownloads = docSnap.data().downloads || 0;
                await updateDoc(docRef, {
                    downloads: currentDownloads + 1
                });
            }
        } catch (error) {
            console.error('Error incrementing download count:', error);
        }
    }

    // TEMPORARY DEBUG FUNCTION - Remove after debugging
    static async debugToolExists(toolId: string): Promise<void> {
        console.log('🔍 Debug: Checking if tool exists:', toolId);

        try {
            // Check publishedTools collection
            const docRef = doc(db, 'publishedTools', toolId);
            const docSnap = await getDoc(docRef);
            console.log('📄 publishedTools check:', { exists: docSnap.exists() });

            if (docSnap.exists()) {
                console.log('📄 Document data:', docSnap.data());
            }

            // List all tools in the collection (limited to 10 for debugging)
            console.log('📋 Listing all tools in publishedTools (first 10):');
            const listQuery = query(collection(db, 'publishedTools'), limit(10));
            const listSnapshot = await getDocs(listQuery);

            listSnapshot.docs.forEach(doc => {
                console.log('📄 Found tool:', { id: doc.id, name: doc.data().name, authorEmail: doc.data().authorEmail });
            });

        } catch (error) {
            console.error('❌ Debug error:', error);
        }
    }

    // Archive tools - FIXED VERSION with proper ID handling
    static async archiveTools(toolIds: string[], authorEmail: string): Promise<void> {
        try {
            console.log('🔍 Starting archive operation:', { toolIds, authorEmail });

            // First, let's get all user tools and create an ID mapping
            console.log('📋 Getting user tools to create ID mapping...');
            const userTools = await this.getMyPublishedTools(authorEmail);

            // Create mapping from both possible IDs to Firestore document ID
            const idMapping = new Map();
            userTools.forEach(tool => {
                idMapping.set(tool.id, tool.firestoreId || tool.id); // Map display ID to Firestore ID
                if (tool.dataId && tool.dataId !== tool.id) {
                    idMapping.set(tool.dataId, tool.firestoreId || tool.id); // Map data ID to Firestore ID
                }
            });

            console.log('📋 ID Mapping created:', Object.fromEntries(idMapping));

            const promises = toolIds.map(async (toolId, index) => {
                console.log(`🔍 Processing tool ${index + 1}/${toolIds.length}: ${toolId}`);

                // Get the actual Firestore document ID
                const firestoreId = idMapping.get(toolId) || toolId;
                console.log('🔍 Using Firestore ID:', firestoreId, 'for input ID:', toolId);

                const docRef = doc(db, 'publishedTools', firestoreId);

                try {
                    const docSnap = await getDoc(docRef);
                    console.log('📄 Document fetch result:', { exists: docSnap.exists(), firestoreId });

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        console.log('📄 Document data:', {
                            firestoreId,
                            authorEmail: data.authorEmail,
                            expectedEmail: authorEmail,
                            isArchived: data.isArchived,
                            name: data.name
                        });

                        if (data.authorEmail === authorEmail) {
                            console.log('✅ Authorization check passed, updating document...');
                            await updateDoc(docRef, {
                                isArchived: true,
                                archivedAt: new Date()
                            });
                            console.log('✅ Document updated successfully');
                        } else {
                            throw new Error(`Unauthorized to archive tool ${toolId}. Document author: ${data.authorEmail}, Current user: ${authorEmail}`);
                        }
                    } else {
                        throw new Error(`Tool ${toolId} (Firestore ID: ${firestoreId}) not found in publishedTools collection`);
                    }
                } catch (docError) {
                    console.error(`❌ Error processing document ${toolId}:`, docError);
                    throw docError;
                }
            });

            await Promise.all(promises);
            console.log('✅ All tools archived successfully');
        } catch (error) {
            console.error('❌ Error archiving tools:', error);
            throw error;
        }
    }

    static async unarchiveTool(toolId: string, authorEmail: string): Promise<void> {
        try {
            console.log('🔍 Starting unarchive operation:', { toolId, authorEmail });

            // First, get all archived tools to create ID mapping
            console.log('📋 Getting archived tools to create ID mapping...');
            const archivedTools = await this.getArchivedTools(authorEmail);

            // Create mapping from both possible IDs to Firestore document ID
            const idMapping = new Map();
            archivedTools.forEach(tool => {
                idMapping.set(tool.id, tool.firestoreId || tool.id); // Map display ID to Firestore ID
                if (tool.dataId && tool.dataId !== tool.id) {
                    idMapping.set(tool.dataId, tool.firestoreId || tool.id); // Map data ID to Firestore ID
                }
            });

            console.log('📋 ID Mapping for archived tools:', Object.fromEntries(idMapping));

            // Get the actual Firestore document ID
            const firestoreId = idMapping.get(toolId) || toolId;
            console.log('🔍 Using Firestore ID:', firestoreId, 'for input ID:', toolId);

            const docRef = doc(db, 'publishedTools', firestoreId);
            const docSnap = await getDoc(docRef);

            console.log('📄 Document fetch result:', { exists: docSnap.exists(), firestoreId });

            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log('📄 Document data:', {
                    firestoreId,
                    authorEmail: data.authorEmail,
                    expectedEmail: authorEmail,
                    isArchived: data.isArchived,
                    name: data.name
                });

                if (data.authorEmail === authorEmail) {
                    console.log('✅ Authorization check passed, updating document...');
                    await updateDoc(docRef, {
                        isArchived: false,
                        archivedAt: null
                    });
                    console.log('✅ Document unarchived successfully');
                } else {
                    throw new Error(`Unauthorized to unarchive tool ${toolId}. Document author: ${data.authorEmail}, Current user: ${authorEmail}`);
                }
            } else {
                console.log('❌ Document does not exist:', { toolId, firestoreId });
                throw new Error(`Tool ${toolId} (Firestore ID: ${firestoreId}) not found`);
            }
        } catch (error) {
            console.error('Error unarchiving tool:', error);
            throw error;
        }
    }

    // Delete published items (for user's own published content)
    static async deletePublishedAgent(agentId: string, authorEmail: string): Promise<void> {
        try {
            const docRef = doc(db, 'publishedAgents', agentId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && docSnap.data().authorEmail === authorEmail) {
                await deleteDoc(docRef);
            } else {
                throw new Error('Unauthorized to delete this agent');
            }
        } catch (error) {
            console.error('Error deleting published agent:', error);
            throw error;
        }
    }

    static async deletePublishedTool(toolId: string, authorEmail: string): Promise<void> {
        try {
            console.log('🔍 Starting delete operation:', { toolId, authorEmail });

            // Get all user tools (both published and archived) to create ID mapping
            const [publishedTools, archivedTools] = await Promise.all([
                this.getMyPublishedTools(authorEmail),
                this.getArchivedTools(authorEmail)
            ]);

            const allTools = [...publishedTools, ...archivedTools];

            // Create mapping from both possible IDs to Firestore document ID
            const idMapping = new Map();
            allTools.forEach(tool => {
                idMapping.set(tool.id, tool.firestoreId || tool.id);
                if (tool.dataId && tool.dataId !== tool.id) {
                    idMapping.set(tool.dataId, tool.firestoreId || tool.id);
                }
            });

            const firestoreId = idMapping.get(toolId) || toolId;
            console.log('🔍 Using Firestore ID:', firestoreId, 'for input ID:', toolId);

            const docRef = doc(db, 'publishedTools', firestoreId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && docSnap.data().authorEmail === authorEmail) {
                await deleteDoc(docRef);
                console.log('✅ Tool deleted successfully');
            } else {
                throw new Error(`Unauthorized to delete tool ${toolId} or tool not found`);
            }
        } catch (error) {
            console.error('Error deleting published tool:', error);
            throw error;
        }
    }

    static async deleteMultiplePublishedTools(toolIds: string[], authorEmail: string): Promise<void> {
        try {
            console.log('🔍 Starting delete operation for multiple tools:', { toolIds, authorEmail });

            // Get all user tools (both published and archived) to create ID mapping
            const [publishedTools, archivedTools] = await Promise.all([
                this.getMyPublishedTools(authorEmail),
                this.getArchivedTools(authorEmail)
            ]);

            const allTools = [...publishedTools, ...archivedTools];

            // Create mapping from both possible IDs to Firestore document ID
            const idMapping = new Map();
            allTools.forEach(tool => {
                idMapping.set(tool.id, tool.firestoreId || tool.id);
                if (tool.dataId && tool.dataId !== tool.id) {
                    idMapping.set(tool.dataId, tool.firestoreId || tool.id);
                }
            });

            const promises = toolIds.map(async (toolId) => {
                const firestoreId = idMapping.get(toolId) || toolId;
                const docRef = doc(db, 'publishedTools', firestoreId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists() && docSnap.data().authorEmail === authorEmail) {
                    await deleteDoc(docRef);
                    console.log(`✅ Tool deleted: ${firestoreId}`);
                } else {
                    throw new Error(`Unauthorized to delete tool ${toolId}`);
                }
            });

            await Promise.all(promises);
            console.log('✅ All specified tools deleted successfully');
        } catch (error) {
            console.error('Error deleting multiple published tools:', error);
            throw error;
        }
    }


    // Update published items
    static async updatePublishedAgent(agentId: string, updatedData: Partial<Agent>, authorEmail: string): Promise<void> {
        try {
            const docRef = doc(db, 'publishedAgents', agentId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && docSnap.data().authorEmail === authorEmail) {
                await updateDoc(docRef, {
                    ...updatedData,
                    updatedAt: new Date()
                });
            } else {
                throw new Error('Unauthorized to update this agent');
            }
        } catch (error) {
            console.error('Error updating published agent:', error);
            throw error;
        }
    }

    static async updatePublishedTool(toolId: string, updatedData: Partial<Tool>, authorEmail: string): Promise<void> {
        try {
            console.log('🔍 Starting update operation:', { toolId, authorEmail });

            // Get all user tools (both published and archived) to create ID mapping
            const [publishedTools, archivedTools] = await Promise.all([
                this.getMyPublishedTools(authorEmail),
                this.getArchivedTools(authorEmail)
            ]);

            const allTools = [...publishedTools, ...archivedTools];

            // Create mapping from both possible IDs to Firestore document ID
            const idMapping = new Map();
            allTools.forEach(tool => {
                idMapping.set(tool.id, tool.firestoreId || tool.id);
                if (tool.dataId && tool.dataId !== tool.id) {
                    idMapping.set(tool.dataId, tool.firestoreId || tool.id);
                }
            });

            const firestoreId = idMapping.get(toolId) || toolId;
            console.log('🔍 Using Firestore ID:', firestoreId, 'for input ID:', toolId);

            const docRef = doc(db, 'publishedTools', firestoreId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && docSnap.data().authorEmail === authorEmail) {
                await updateDoc(docRef, {
                    ...updatedData,
                    updatedAt: new Date()
                });
                console.log('✅ Tool updated successfully');
            } else {
                throw new Error(`Unauthorized to update tool ${toolId} or tool not found`);
            }
        } catch (error) {
            console.error('Error updating published tool:', error);
            throw error;
        }
    }
}