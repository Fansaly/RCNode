import React from 'react';
import { RouteObject } from 'react-router-dom';

import { CNodeTab as Tab, TopicTab } from '@/router';

declare global {
  namespace RCNode {
    interface AuthState {
      isAuthed: boolean;
      accesstoken?: string;
      avatar?: string;
      uname?: string;
      uid?: string;
    }

    type Meta = Record<string, any>;

    type Component =
      | React.LazyExoticComponent<React.ComponentType>
      | React.ElementType<any>;
    type RouteElement = Component | React.ReactNode;
    interface RouteProps extends Omit<RouteObject, 'children' | 'element'> {
      children?: RouteProps[];
      element?: RouteElement;
      meta?: Meta;
    }

    type HTMLAttributes = undefined | null | Record<string, null | string>;
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

    type CNodeTab = Tab;
    type CNodeTopicTab = TopicTab;

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
