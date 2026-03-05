// Mock MongoDB/Mongoose - No real database needed for tests
import mongoose from 'mongoose';

// Mock data storage (in-memory)
const mockData: {
  messages: any[];
  reviews: any[];
  bookings: any[];
} = {
  messages: [],
  reviews: [],
  bookings: [],
};

// Helper to generate ObjectId-like strings
const generateId = () => new mongoose.Types.ObjectId().toString();

// Helper to reset mock data
export const resetMockData = () => {
  mockData.messages = [];
  mockData.reviews = [];
  mockData.bookings = [];
};

// Define query interface type
interface QueryMock {
  sort: (obj: any) => QueryMock;
  limit: (num: number) => QueryMock;
  skip: (num: number) => QueryMock;
  select: (fields: string | string[]) => QueryMock;
  lean: () => QueryMock;
  exec: () => Promise<any[]>;
}

// Create a chainable query mock
// Accepts a function that returns the collection to get fresh reference after resetMockData
const createQueryMock = (getCollectionFn: () => any[], initialFilter: any = {}): QueryMock => {
  let filter = { ...initialFilter };
  let sortObj: any = {};
  let limitNum: number | null = null;
  let skipNum = 0;
  let selectFields: string[] | null = null;
  let leanMode = false;

  const query: QueryMock = {
    sort: jest.fn((obj: any) => {
      sortObj = obj;
      return query;
    }) as any,
    limit: jest.fn((num: number) => {
      limitNum = num;
      return query;
    }) as any,
    skip: jest.fn((num: number) => {
      skipNum = num;
      return query;
    }) as any,
    select: jest.fn((fields: string | string[]) => {
      selectFields = Array.isArray(fields) ? fields : fields.split(' ');
      return query;
    }) as any,
    lean: jest.fn(() => {
      leanMode = true;
      return query;
    }) as any,
    exec: jest.fn(async () => {
      // Get fresh collection reference
      const collection = getCollectionFn();
      let results = [...collection];
      
      // Apply filters
      if (filter.deleted !== undefined) {
        results = results.filter((item: any) => {
          // Treat undefined as false for comparison
          const itemDeleted = item.deleted === true;
          const filterDeleted = filter.deleted === true;
          // Return true if both are the same boolean value
          return itemDeleted === filterDeleted;
        });
      }
      if (filter.approved !== undefined) {
        results = results.filter((item: any) => {
          // Treat undefined as false for comparison
          const itemApproved = item.approved === true;
          const filterApproved = filter.approved === true;
          // Return true if both are the same boolean value
          return itemApproved === filterApproved;
        });
      }
      // Handle status filter
      if (filter.status !== undefined) {
        results = results.filter((item: any) => item.status === filter.status);
      }
      if (filter._id) {
        results = results.filter((item: any) => item._id.toString() === filter._id.toString());
      }
      
      // Apply sorting
      if (Object.keys(sortObj).length > 0) {
        const sortKey = Object.keys(sortObj)[0];
        const sortOrder = sortObj[sortKey];
        results.sort((a: any, b: any) => {
          const aVal = a[sortKey] instanceof Date ? a[sortKey].getTime() : a[sortKey];
          const bVal = b[sortKey] instanceof Date ? b[sortKey].getTime() : b[sortKey];
          return sortOrder === -1 ? bVal - aVal : aVal - bVal;
        });
      }
      
      // Apply skip first, then limit
      const afterSkip = results.slice(skipNum);
      
      // Apply limit after skip
      if (limitNum !== null) {
        results = afterSkip.slice(0, limitNum);
      } else {
        results = afterSkip;
      }
      
      // Apply select
      if (selectFields) {
        results = results.map((item: any) => {
          const selected: any = {};
          const fieldsToInclude = selectFields!.filter((f: string) => !f.startsWith('-'));
          const fieldsToExclude = selectFields!.filter((f: string) => f.startsWith('-')).map((f: string) => f.substring(1));
          
          if (fieldsToInclude.length > 0) {
            // Include only specified fields
            fieldsToInclude.forEach((field: string) => {
              // Include field even if value is false, 0, or empty string
              if (item.hasOwnProperty(field)) {
                selected[field] = item[field];
              }
            });
            // Always include _id
            selected._id = item._id;
          } else {
            // Exclude specified fields
            Object.keys(item).forEach((key) => {
              if (!fieldsToExclude.includes(key)) {
                selected[key] = item[key];
              }
            });
          }
          return selected;
        });
      }
      
      return results;
    }) as any,
  };

  return query;
};

// Mock mongoose model operations
const createMockModel = (collectionName: 'messages' | 'reviews' | 'bookings') => {
  // Always access mockData[collectionName] directly to get fresh reference after resetMockData
  const getCollection = () => mockData[collectionName];
  
  return {
    find: jest.fn((query: any = {}) => {
      return createQueryMock(getCollection, query);
    }),
    
    findById: jest.fn((id: string | undefined) => {
      // Handle empty, undefined, or invalid IDs
      // Check for empty string, undefined, null, or whitespace-only strings
      if (!id || id === '' || id === undefined || id === null || 
          (typeof id === 'string' && id.trim() === '')) {
        // Return a thenable that resolves to null for empty/invalid IDs
        const nullQuery = {
          select: jest.fn(() => ({ lean: jest.fn(() => Promise.resolve(null)) })),
          lean: jest.fn(() => Promise.resolve(null)),
          exec: jest.fn(() => Promise.resolve(null)),
          then: (onResolve: any) => Promise.resolve(null).then(onResolve),
          catch: (onReject: any) => Promise.resolve(null).catch(onReject),
        };
        return nullQuery;
      }
      
      // Normalize ID for comparison
      const searchId = id.toString().trim();
      const collection = getCollection(); // Get fresh collection reference
      // Always get the latest item from collection (in case it was updated)
      const item = collection.find((doc: any) => {
        const docId = doc._id ? doc._id.toString().trim() : '';
        return docId === searchId;
      });
      
      if (!item) {
        // Return a thenable that resolves to null
        return {
          select: jest.fn(() => ({ lean: jest.fn(() => Promise.resolve(null)) })),
          lean: jest.fn(() => Promise.resolve(null)),
          exec: jest.fn(() => Promise.resolve(null)),
          then: (onResolve: any) => Promise.resolve(null).then(onResolve),
          catch: (onReject: any) => Promise.resolve(null).catch(onReject),
        };
      }
      
      // Create a mutable copy of the item with fresh data from collection
      const docInstance: any = {
        ...item,
        replies: item.replies ? [...item.replies] : [],
      };
      
      // Add save method that updates the collection
      docInstance.save = jest.fn(async () => {
        const collection = getCollection(); // Get fresh collection reference
        const searchId = id.toString().trim();
        const index = collection.findIndex((doc: any) => {
          const docId = doc._id ? doc._id.toString().trim() : '';
          return docId === searchId;
        });
        if (index >= 0) {
          // Update the collection with current state, ensuring updatedAt changes
          const now = new Date();
          // Preserve ALL properties from docInstance including deleted, approved, replies, etc.
          const updatedDoc: any = {};
          // Copy all properties from docInstance - get current state
          for (const key in docInstance) {
            if (docInstance.hasOwnProperty(key) && key !== 'save') {
              if (key === 'replies' && Array.isArray(docInstance[key])) {
                // Deep copy replies array to preserve all nested objects
                updatedDoc[key] = docInstance[key].map((reply: any) => ({ ...reply }));
              } else if (key === 'updatedAt') {
                updatedDoc[key] = now; // Always use new Date
              } else {
                updatedDoc[key] = docInstance[key];
              }
            }
          }
          // Ensure updatedAt is set
          updatedDoc.updatedAt = now;
          // Ensure replies exists even if empty
          if (!updatedDoc.replies) {
            updatedDoc.replies = [];
          }
          collection[index] = updatedDoc;
          // Update the docInstance to reflect changes
          Object.assign(docInstance, updatedDoc);
        } else {
          // If not found, add it (shouldn't happen but handle it)
          const now = new Date();
          const newDoc: any = {};
          for (const key in docInstance) {
            if (docInstance.hasOwnProperty(key) && key !== 'save') {
              if (key === 'replies' && Array.isArray(docInstance[key])) {
                newDoc[key] = docInstance[key].map((reply: any) => ({ ...reply }));
              } else {
                newDoc[key] = docInstance[key];
              }
            }
          }
          newDoc.updatedAt = now;
          if (!newDoc.replies) {
            newDoc.replies = [];
          }
          collection.push(newDoc);
          Object.assign(docInstance, newDoc);
        }
        return docInstance;
      });
      
      // Create query builder object that supports both chaining and direct await
      const queryBuilder: any = {
        select: jest.fn((fields: string) => {
          // Get fresh item from collection
          const collection = getCollection(); // Get fresh collection reference
          const searchId = id.toString().trim();
          const freshItem = collection.find((doc: any) => {
            const docId = doc._id ? doc._id.toString().trim() : '';
            return docId === searchId;
          });
          const result: any = freshItem ? { ...freshItem } : null;
          if (result && fields.startsWith('-')) {
            const excludeField = fields.substring(1);
            delete result[excludeField];
          }
          return {
            lean: jest.fn(() => Promise.resolve(result)),
            exec: jest.fn(() => Promise.resolve(result)),
            then: (onResolve: any) => Promise.resolve(result).then(onResolve),
            catch: (onReject: any) => Promise.resolve(result).catch(onReject),
          };
        }),
        lean: jest.fn(() => {
          // Get fresh item from collection
          const collection = getCollection(); // Get fresh collection reference
          const searchId = id.toString().trim();
          const freshItem = collection.find((doc: any) => {
            const docId = doc._id ? doc._id.toString().trim() : '';
            return docId === searchId;
          });
          return Promise.resolve(freshItem || null);
        }),
        exec: jest.fn(() => {
          // Get fresh item from collection and create document instance
          const collection = getCollection(); // Get fresh collection reference
          const searchId = id.toString().trim();
          const freshItem = collection.find((doc: any) => {
            const docId = doc._id ? doc._id.toString().trim() : '';
            return docId === searchId;
          });
          if (!freshItem) return Promise.resolve(null);
          // Create fresh document instance with save method
          const freshDocInstance: any = {
            ...freshItem,
          };
          // Ensure replies array exists (for messages)
          if (collectionName === 'messages') {
            freshDocInstance.replies = freshItem.replies ? freshItem.replies.map((reply: any) => ({ ...reply })) : [];
          }
          // Add save method that updates the collection
          freshDocInstance.save = jest.fn(async () => {
            const collection = getCollection(); // Get fresh collection reference
            const searchId = id.toString().trim();
            const index = collection.findIndex((doc: any) => {
              const docId = doc._id ? doc._id.toString().trim() : '';
              return docId === searchId;
            });
            if (index >= 0) {
              const now = new Date();
              const updatedDoc: any = {};
              for (const key in freshDocInstance) {
                if (freshDocInstance.hasOwnProperty(key) && key !== 'save') {
                  if (key === 'replies' && Array.isArray(freshDocInstance[key])) {
                    // Deep copy replies array to preserve all nested objects
                    updatedDoc[key] = freshDocInstance[key].map((reply: any) => ({ ...reply }));
                  } else if (key === 'updatedAt') {
                    updatedDoc[key] = now;
                  } else {
                    updatedDoc[key] = freshDocInstance[key];
                  }
                }
              }
              updatedDoc.updatedAt = now;
              // Ensure replies exists even if empty
              if (!updatedDoc.replies) {
                updatedDoc.replies = [];
              }
              collection[index] = updatedDoc;
              Object.assign(freshDocInstance, updatedDoc);
            } else {
              // If not found, add it
              const now = new Date();
              const newDoc: any = {};
              for (const key in freshDocInstance) {
                if (freshDocInstance.hasOwnProperty(key) && key !== 'save') {
                  if (key === 'replies' && Array.isArray(freshDocInstance[key])) {
                    newDoc[key] = freshDocInstance[key].map((reply: any) => ({ ...reply }));
                  } else {
                    newDoc[key] = freshDocInstance[key];
                  }
                }
              }
              newDoc.updatedAt = now;
              if (!newDoc.replies) {
                newDoc.replies = [];
              }
              collection.push(newDoc);
              Object.assign(freshDocInstance, newDoc);
            }
            return freshDocInstance;
          });
          return Promise.resolve(freshDocInstance);
        }),
        // Make it thenable so it can be awaited directly (like mongoose Query)
        then: (onResolve: any, onReject?: any) => {
          return Promise.resolve(docInstance).then(onResolve, onReject);
        },
        catch: (onReject: any) => {
          return Promise.resolve(docInstance).catch(onReject);
        },
        // Support Symbol.toPrimitive for better compatibility
        [Symbol.toPrimitive]: () => '[object Object]',
      };
      
      // Merge document properties into query builder for direct access
      // This allows direct property access and mutation (e.g., message.replies.push())
      if (docInstance) {
        // First, set replies as a direct reference for mutation support
        if (docInstance.replies) {
          queryBuilder.replies = docInstance.replies; // Direct reference for array mutations
        } else {
          queryBuilder.replies = [];
          docInstance.replies = [];
        }
        
        // Copy all other properties
        Object.keys(docInstance).forEach((key) => {
          if (key !== 'save' && key !== 'replies' && !queryBuilder.hasOwnProperty(key)) {
            Object.defineProperty(queryBuilder, key, {
              get: () => docInstance[key],
              set: (value) => { 
                docInstance[key] = value;
                // Also update collection immediately for consistency
                const collection = getCollection(); // Get fresh collection reference
                const searchId = id.toString().trim();
                const index = collection.findIndex((doc: any) => {
                  const docId = doc._id ? doc._id.toString().trim() : '';
                  return docId === searchId;
                });
                if (index >= 0) {
                  collection[index][key] = value;
                }
              },
              enumerable: true,
              configurable: true,
            });
          }
        });
        // Add save method
        queryBuilder.save = docInstance.save;
      }
      
      return queryBuilder;
    }),
    
    findByIdAndUpdate: jest.fn((id: string, update: any, options: any = {}) => {
      // Handle empty, undefined, or invalid IDs
      if (!id || id === '' || id === undefined || id === null || 
          (typeof id === 'string' && id.trim() === '')) {
        return Promise.resolve(null);
      }
      
      const collection = getCollection(); // Get fresh collection reference
      // Normalize ID for comparison
      const searchId = id.toString().trim();
      const index = collection.findIndex((doc: any) => {
        const docId = doc._id ? doc._id.toString().trim() : '';
        return docId === searchId;
      });
      
      if (index === -1) {
        return Promise.resolve(null);
      }
      
      // Apply update to existing document
      const updated = { 
        ...collection[index], 
        ...update,
        updatedAt: new Date(),
      };
      
      // If new option is not false, update the collection
      if (options.new !== false) {
        collection[index] = updated;
      }
      
      return Promise.resolve(updated);
    }),
    
    findOneAndUpdate: jest.fn((query: any, update: any, options: any = {}) => {
      const collection = getCollection();
      const id = query._id;
      if (!id) return Promise.resolve(null);
      const searchId = id.toString().trim();
      const index = collection.findIndex((doc: any) => {
        const docId = doc._id ? doc._id.toString().trim() : '';
        if (docId !== searchId) return false;
        if (query.deleted && query.deleted.$ne === true && doc.deleted === true) return false;
        return true;
      });
      if (index === -1) return Promise.resolve(null);
      const updated = { ...collection[index], ...update, updatedAt: new Date() };
      if (options.new !== false) collection[index] = updated;
      return Promise.resolve(updated);
    }),
    
    create: jest.fn((data: any) => {
      // Spread data first, then set defaults only for missing fields
      const newDoc: any = {
        ...data,
        _id: (data._id || generateId()).toString().trim(),
        createdAt: data.createdAt || new Date(),
        updatedAt: data.updatedAt || new Date(),
      };
      // Set defaults only if not provided
      if (newDoc.deleted === undefined && collectionName === 'messages') {
        newDoc.deleted = false;
      }
      if (newDoc.approved === undefined && collectionName === 'reviews') {
        newDoc.approved = false;
      }
      if (newDoc.status === undefined && collectionName === 'bookings') {
        newDoc.status = 'pending';
      }
      if (newDoc.replies === undefined && collectionName === 'messages') {
        newDoc.replies = [];
      }
      const collection = getCollection(); // Get fresh collection reference
      collection.push(newDoc);
      return Promise.resolve(newDoc);
    }),
    
    deleteMany: jest.fn((query: any = {}) => {
      const collection = getCollection(); // Get fresh collection reference
      if (Object.keys(query).length === 0) {
        const count = collection.length;
        collection.length = 0;
        return Promise.resolve({ deletedCount: count });
      }
      // Apply query filters
      const initialLength = collection.length;
      const filtered = collection.filter((doc: any) => {
        return Object.keys(query).every((key) => doc[key] === query[key]);
      });
      filtered.forEach((doc: any) => {
        const index = collection.indexOf(doc);
        if (index > -1) collection.splice(index, 1);
      });
      return Promise.resolve({ deletedCount: initialLength - collection.length });
    }),
    
    updateMany: jest.fn((query: any, update: any) => {
      const collection = getCollection(); // Get fresh collection reference
      let modifiedCount = 0;
      collection.forEach((doc: any) => {
        if (Object.keys(query).every((key) => doc[key] === query[key])) {
          Object.assign(doc, update);
          modifiedCount++;
        }
      });
      return Promise.resolve({ modifiedCount });
    }),
    
    countDocuments: jest.fn((query: any = {}) => {
      const collection = getCollection(); // Get fresh collection reference
      if (Object.keys(query).length === 0) {
        return Promise.resolve(collection.length);
      }
      let filtered = [...collection];
      
      // Apply filters with same logic as find().exec()
      if (query.deleted !== undefined) {
        filtered = filtered.filter((item: any) => {
          const itemDeleted = item.deleted === true;
          const filterDeleted = query.deleted === true;
          return itemDeleted === filterDeleted;
        });
      }
      if (query.approved !== undefined) {
        filtered = filtered.filter((item: any) => {
          const itemApproved = item.approved === true;
          const filterApproved = query.approved === true;
          return itemApproved === filterApproved;
        });
      }
      if (query.status !== undefined) {
        filtered = filtered.filter((item: any) => item.status === query.status);
      }
      // For other fields, use exact match
      Object.keys(query).forEach((key) => {
        if (key !== 'deleted' && key !== 'approved' && key !== 'status') {
          filtered = filtered.filter((doc: any) => doc[key] === query[key]);
        }
      });
      
      return Promise.resolve(filtered.length);
    }),
  };
};

// Mock mongoose models
// Path from tests/setup.ts: ../src/models/Message (one level up to backend root)
jest.mock('../src/models/Message', () => {
  const mockModel = createMockModel('messages');
  
  // Mock constructor for new Message()
  const MockMessage = function(this: any, data: any) {
    // Generate ID first, ensuring it's a string
    const id = (data._id || generateId()).toString().trim();
    // Assign all properties from data first, then override with defaults
    Object.assign(this, data, {
      _id: id, // Ensure _id is set last to override any from data
      deleted: data.deleted !== undefined ? data.deleted : false,
      replies: data.replies || [],
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
    });
    
    this.save = jest.fn(async () => {
      // Validation: Check required fields
      if (!this.name || !this.email || !this.message) {
        const missing = [];
        if (!this.name) missing.push('name');
        if (!this.email) missing.push('email');
        if (!this.message) missing.push('message');
        throw new Error(`${missing.join(', ')} is required`);
      }
      
      // Always update updatedAt with a new Date
      this.updatedAt = new Date();
      
      // Preserve all properties including deleted, etc. - use current this state
      const doc: any = {};
      // Ensure _id is always set first from this._id
      doc._id = (this._id || id).toString().trim();
      
      for (const key in this) {
        if (this.hasOwnProperty(key) && key !== 'save' && key !== '_id') {
          if (key === 'replies' && Array.isArray(this[key])) {
            doc[key] = [...this[key]];
          } else {
            doc[key] = this[key];
          }
        }
      }
      // Ensure defaults are set
      if (doc.deleted === undefined) {
        doc.deleted = false;
      }
      if (!doc.replies) {
        doc.replies = [];
      }
      doc.updatedAt = new Date();
      
      // Check if already exists - use doc._id for consistency
      const searchId = doc._id.toString().trim();
      const index = mockData.messages.findIndex((m: any) => {
        const docId = m._id ? m._id.toString().trim() : '';
        return docId === searchId;
      });
      if (index >= 0) {
        mockData.messages[index] = doc;
      } else {
        mockData.messages.push(doc);
      }
      // Update this to match doc to ensure consistency
      Object.assign(this, doc);
      // Return this so property changes persist
      return this;
    });
    
    return this;
  } as any;
  
  // Attach static methods
  Object.assign(MockMessage, mockModel);
  
  return {
    __esModule: true,
    default: MockMessage,
  };
});

jest.mock('../src/models/Review', () => {
  const mockModel = createMockModel('reviews');
  
  const MockReview = function(this: any, data: any) {
    // Generate ID first, ensuring it's a string
    const id = (data._id || generateId()).toString().trim();
    // Assign all properties from data first, then override with defaults
    Object.assign(this, data, {
      _id: id, // Ensure _id is set last to override any from data
      approved: data.approved !== undefined ? data.approved : false,
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
    });
    
    this.save = jest.fn(async () => {
      // Validation: Check required fields
      if (!this.name || this.rating === undefined || !this.comment) {
        const missing = [];
        if (!this.name) missing.push('name');
        if (this.rating === undefined) missing.push('rating');
        if (!this.comment) missing.push('comment');
        throw new Error(`${missing.join(', ')} is required`);
      }
      
      const doc: any = {};
      // Ensure _id is always set first from this._id
      doc._id = (this._id || id).toString().trim();
      
      for (const key in this) {
        if (this.hasOwnProperty(key) && key !== 'save' && key !== '_id') {
          doc[key] = this[key];
        }
      }
      doc.updatedAt = new Date();
      
      // Use doc._id for consistency
      const searchId = doc._id.toString().trim();
      const index = mockData.reviews.findIndex((r: any) => {
        const docId = r._id ? r._id.toString().trim() : '';
        return docId === searchId;
      });
      if (index >= 0) {
        mockData.reviews[index] = doc;
      } else {
        mockData.reviews.push(doc);
      }
      Object.assign(this, doc);
      return this;
    });
    
    return this;
  } as any;
  
  Object.assign(MockReview, mockModel);
  
  return {
    __esModule: true,
    default: MockReview,
  };
});

jest.mock('../src/models/Booking', () => {
  const mockModel = createMockModel('bookings');
  
  const MockBooking = function(this: any, data: any) {
    // Generate ID first, ensuring it's a string
    const id = (data._id || generateId()).toString().trim();
    // Assign all properties from data first, then override with defaults
    Object.assign(this, data, {
      _id: id, // Ensure _id is set last to override any from data
      status: data.status || 'pending',
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
    });
    
    this.save = jest.fn(async () => {
      // Validation: Check required fields
      if (!this.name || !this.email || !this.phone || !this.serviceType) {
        const missing = [];
        if (!this.name) missing.push('name');
        if (!this.email) missing.push('email');
        if (!this.phone) missing.push('phone');
        if (!this.serviceType) missing.push('serviceType');
        throw new Error(`${missing.join(', ')} is required`);
      }
      
      const doc: any = {};
      // Ensure _id is always set first from this._id
      doc._id = (this._id || id).toString().trim();
      
      for (const key in this) {
        if (this.hasOwnProperty(key) && key !== 'save' && key !== '_id') {
          doc[key] = this[key];
        }
      }
      doc.updatedAt = new Date();
      
      // Use doc._id for consistency
      const searchId = doc._id.toString().trim();
      const index = mockData.bookings.findIndex((b: any) => {
        const docId = b._id ? b._id.toString().trim() : '';
        return docId === searchId;
      });
      if (index >= 0) {
        mockData.bookings[index] = doc;
      } else {
        mockData.bookings.push(doc);
      }
      Object.assign(this, doc);
      return this;
    });
    
    return this;
  } as any;
  
  Object.assign(MockBooking, mockModel);
  
  return {
    __esModule: true,
    default: MockBooking,
  };
});

// Setup and teardown
beforeAll(() => {
  // No database connection needed - all mocked
  resetMockData();
});

afterEach(() => {
  // Reset mock data after each test
  resetMockData();
  jest.clearAllMocks();
});

afterAll(() => {
  // Cleanup
  resetMockData();
});
