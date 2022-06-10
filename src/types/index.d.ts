import React from 'react';
import { RouteObject } from 'react-router-dom';

declare global {
  namespace RCNode {
    interface AuthState {
      isAuthed: boolean;
      accesstoken?: string;
      avatar?: string;
      uname?: string;
      uid?: string;
    }

    interface Meta {
      [key: string]: any;
    }

    interface RouteProps extends RouteObject {
      children?: RouteProps[];
      element?: any;
      meta?: Meta;
    }

    type HTMLAttributes =
      | undefined
      | null
      | {
          [key: string]: null | string;
        };
    interface NormalProps {
      title?: string;
      htmlAttributes?: HTMLAttributes;
      bodyAttributes?: HTMLAttributes;
      withHeader?: boolean;
      reset?: boolean;
    }
    interface AppProps extends NormalProps {
      children?: React.ReactNode;
      meta?: Meta;
    }

    type CNodeTopicTab = 'share' | 'ask' | 'job' | 'dev';
    type CNodeTab = 'all' | 'good' | CNodeTopicTab;
    interface CNodePathProps {
      name: string;
      path: string;
      isTopicTab?: boolean;
    }

    interface EditorData {
      title?: string;
      content?: string;
      topicTab?: CNodeTopicTab;
    }
    interface EditorBasic extends EditorData {
      open: boolean;
      action: 'create' | 'update' | 'reply';
    }
    interface EditorChange {
      onChange?: (data: EditorData) => void;
    }
    interface EditorSubmit {
      onSubmit?: (event?: React.MouseEvent) => void;
    }
    interface EditorClose {
      onClose?: (event?: React.MouseEvent) => void;
    }
    interface EditorActions extends EditorChange, EditorSubmit, EditorClose {}
    interface Editor extends EditorBasic, EditorActions {}

    interface Notification {
      open: boolean;
      status?: 'info' | 'success' | 'warning' | 'error';
      message: string;
      onClose?: () => void;
    }
    interface Share {
      open: boolean;
      url: string;
      post?: null | number | string;
      onClose?: () => void;
    }
  }
}
