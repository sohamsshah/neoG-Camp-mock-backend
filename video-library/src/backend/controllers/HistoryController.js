import { Response} from "miragejs"
import { requiresAuth } from "../utils/authUtils";

/**
 * All the routes related to User History are present here.
 * These are private routes.
 * Client needs to add "authorization" header with JWT token in it to access it.
 * */

/**
 * This handler handles getting videos from user's history.
 * send GET Request at /api/user/history
 * */
export const getHistoryVideosHandler = function(schema, request) {
    const user = requiresAuth.call(this, request);
    if(user){
      return {history: user.history}
    }
  }

/**
 * This handler handles adding videos to user's history.
 * send POST Request at /api/user/history
 * body contains {video}
 * */

export const addVideoToHistoryHandler = function(schema, request) {
  const user = requiresAuth.call(this, request);
  if(user){
    const {video} = JSON.parse(request.requestBody);
    user.history.push(video);
    return new Response(201, {}, {history: user.history} );
  }
  return new Response(401, { errors: [ 'The token is invalid. Unauthorized access error.'] });
}

/**
 * This handler handles removing videos from user's history.
 * send DELETE Request at /api/user/history
 * body contains {video}
 * */

export const removeVideoFromHistoryHandler = function(schema, request) {
  const user = requiresAuth.call(this, request);
  if(user){
    const {video} = JSON.parse(request.requestBody);
    const filteredHistory = user.history.filter(item => item._id !== video._id);
    this.db.users.update({history: filteredHistory});
    return new Response(201, {}, {history: filteredHistory} );
  }
  return new Response(404, { errors: [ 'The user you request does not exist. Not Found error.'] });
}

/**
 * This handler handles removing videos from user's history.
 * send DELETE Request at /api/user/history/all
 * */

 export const clearHistoryHandler = function(schema, request) {
    const user = requiresAuth.call(this, request);
    if(user){
      this.db.users.update({history: []});
      return new Response(201, {}, {history: []} );
    }
    return new Response(404, { errors: [ 'The user you request does not exist. Not Found error.'] });
  }