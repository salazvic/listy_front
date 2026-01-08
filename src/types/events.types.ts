export enum Events {
  // ---- USERS / AUTH ----
  USER_CONNECTED = 'user:connected',
  USER_DISCONNECTED = 'user:disconnected',
  USER_REGISTERED = 'user:registered',
  USER_DELETED = 'user:deleted',
  USER_JOIN = 'user:join',
  USER_PROFILE= 'user:profile',

  // ---- LISTS ----
  LIST_CREATED = 'list:created',
  LIST_UPDATED = 'list:updated',
  LIST_DELETED = 'list:deleted',
  LIST_JOIN = 'list:join',
  LIST_LEFT = 'list:leave',
  LIST_JOINED = 'list:joined',

  // ---- ITEMS ----
  ITEM_CREATED = 'item:created',
  ITEM_UPDATED = 'item:updated',
  ITEM_DELETED = 'item:deleted',

  // ---- ITEM_LIST ----
  ITEM_LIST_ADDED = 'item_list:added',
  ITEM_LIST_DELETED = 'item_list:deleted',
  ITEM_LIST_UPDATED = 'item_list:updated',
  ALL_ITEM_LIST_UPDATED = 'item_list:all item updated',
  ITEM_PURCHASED = 'item_list:purchased',

  // ---- SHARED LIST ----
  SHARED_ADDED = 'shared:user_added',
  SHARED_REMOVED = 'shared:user_removed',
  SHARED_USER_ROL = 'shared:user_rol'
}
