import { createContext, useContext, useCallback, useMemo, useEffect, useRef } from 'react';
import useApi from './useApi.jsx';
import { wsUrl } from '../config.js';
import useToast from '../contexts/useToast';

// oxlint-disable-next-line react/only-export-components
export const DataNotificationsContext = createContext();

const debounceTime = 350; // milliseconds

export function DataNotificationsProvider({ children }) {
  const api = useApi();
  const { addError } = useToast();

  const wsRef = useRef(null);
  const subscriptionsRef = useRef(new Map());
  const nextSubscriptionIdRef = useRef(1);
  const reconnectTimerRef = useRef(null);
  const reconnectAttemptRef = useRef(0);
  const destroyedRef = useRef(false);

  const getTopics = useCallback(() => {
    const topics = new Set();
    for (const subscription of subscriptionsRef.current.values()) {
      topics.add(subscription.topic);
    } 
    return topics;
  }, []);

  const send = useCallback((message) => {
    if (
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }

    return false;
  }, []);

  const connect = useCallback(function connectWS() {
    if (destroyedRef.current)
      return;

    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    if (wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
       wsRef.current.readyState === WebSocket.CONNECTING)
    )
      return;

    const ws = new WebSocket(wsUrl + `/data-notifications`);
    wsRef.current = ws;

    ws.onopen = () => {
      reconnectAttemptRef.current = 0;

      ws.send(JSON.stringify({
        type: 'auth',
        token: api.authorizationToken
      }));
    };

    ws.onclose = () => {
      wsRef.current = null;
      if (destroyedRef.current)
        return;

      const attempt = reconnectAttemptRef.current++;
      const delay = Math.min(30000, 1000 * Math.pow(2, attempt));
      console.warn(`WS disconnected. Reconnecting in ${delay} ms`);
      reconnectTimerRef.current = setTimeout(connectWS, delay);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      switch (msg.type) {
        case 'auth_success':
            for (const topic of getTopics()) {
              ws.send(JSON.stringify({
                type: 'subscribe',
                topic,
              }));
            }
          return;

        case 'subscribe_success':
        case 'unsubscribe_success':
          return;

        case 'subscribe_error':
        case 'unsubscribe_error':
          console.error('WS Data Notification error:', msg.message);
          addError(`Error en notificaciones de datos: ${msg.message}`);
          return;

        case 'data_notification':
          break;

        default:
          console.error('WS Data Notification error: unknown type:', msg.type);
          return;
      }

      for (const subscription of subscriptionsRef.current.values()) {
        if (subscription.topic !== msg.topic)
          continue;

        const now = Date.now();
        if (subscription.still <= now) {
            try {
            subscription.still = now + debounceTime;
            subscription.handler(...subscription.queue, msg);
            subscription.queue = [];
            if (subscription.timeout) {
              clearTimeout(subscription.timeout);
              subscription.timeout = null;
            }
          }
          catch (err) {
            console.error('Error in data notification handler:', err);
          }

          continue;
        }

        subscription.queue ??= [];
        subscription.queue.push(msg);
        if (!subscription.timeout) {
          subscription.timeout = setTimeout(() => {
            subscription.timeout = null;
            if (subscription.queue) {
              try {
                const params = subscription.queue;
                subscription.queue = [];
                subscription.still = Date.now() + debounceTime;
                subscription.handler(...params);
              }
              catch (err) {
                console.error('Error in data notification handler:', err);
              }
            }
          }, subscription.still - now);
        }
      }
    };

    ws.onerror = (err) => {
      console.error('WS Data Notification error:', err);
    };

    return ws;
  }, [api.authorizationToken, getTopics, addError]);

  useEffect(() => {
    if (!api.authorizationToken)
      return;

    reconnectAttemptRef.current = 0;
    destroyedRef.current = false;
    connect();

    return () => {
      destroyedRef.current = true;
      
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }

      if (wsRef.current) {
        const ws = wsRef.current;
        wsRef.current = null;

        ws.onclose = null;
        ws.close();
      }
    };
  }, [api.authorizationToken, connect]);

  const unsubscribe = useCallback((id) => {
    const subscription = subscriptionsRef.current.get(id);
    if (!subscription)
      return;

    subscriptionsRef.current.delete(id);
    if (subscription.timeout) {
      clearTimeout(subscription.timeout);
      subscription.timeout = null;
    }

    const topic = subscription.topic;
    let topicStillUsed = false;
    for (const subscription of subscriptionsRef.current.values()) {
      if (subscription.topic === topic) {
        topicStillUsed = true;
        break;
      }
    }
    if (!topicStillUsed) {
      send({
        type: 'unsubscribe',
        topic: subscription.topic
      });
    }
  }, [send]);

  const subscribe = useCallback((topic, handler) => {
    let topicAlreadyExists = false;
    for (const subscription of subscriptionsRef.current.values()) {
      if (subscription.topic === topic) {
        topicAlreadyExists = true;
        break;
      }
    }

    const id = nextSubscriptionIdRef.current++;
    const subscription = {
      id,
      topic,
      handler,
      queue: [],
      still: Date.now(),
    };
    
    subscriptionsRef.current.set(id, subscription);

    if (!topicAlreadyExists) {
      send({
        type: 'subscribe',
        topic
      });
    }

    return () => unsubscribe(id);
  }, [send, unsubscribe]);

  const value = useMemo(() => ({
    subscribe
  }), [subscribe]);

  return (
    <DataNotificationsContext.Provider value={value}>
      {children}
    </DataNotificationsContext.Provider>
  );
}

// oxlint-disable-next-line react/only-export-components
export default function useDataNotifications() {
  return useContext(DataNotificationsContext);
}