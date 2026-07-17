/**
 * Unified error handling utilities
 */

export interface ErrorHandlerOptions {
  showMessage?: boolean
  logToConsole?: boolean
  customMessage?: string | null
  severity?: 'error' | 'warning' | 'info'
}

export interface NotifyFunction {
  (message: string, severity?: 'error' | 'warning' | 'info'): void
}

interface ErrorLike {
  message?: string
  code?: string
  status?: number
}

type ChatOperation = 'send' | 'create' | 'delete' | 'rename' | 'load' | 'export' | 'stream'

const CHAT_CONTEXT_MAP: Record<ChatOperation, string> = {
  send: '发送消息',
  create: '创建对话',
  delete: '删除对话',
  rename: '重命名对话',
  load: '加载对话',
  export: '导出对话',
  stream: '流式处理'
}

/**
 * Unified error handler
 */
export class ErrorHandler {
  private static notify: NotifyFunction | null = null

  /**
   * Set the notification function to use for displaying messages to the user.
   * If not set, error messages will only be logged to the console.
   */
  static setNotifyFunction(fn: NotifyFunction | null): void {
    this.notify = fn
  }

  /**
   * Handle a generic error
   */
  static handleError(
    error: unknown,
    context = '操作',
    options: ErrorHandlerOptions = {}
  ): unknown {
    const {
      showMessage = true,
      logToConsole = true,
      customMessage = null,
      severity = 'error'
    } = options

    if (logToConsole) {
      console.error(`${context}失败:`, error)
    }

    if (showMessage) {
      const displayMessage = customMessage ?? this.getErrorMessage(error, context)

      if (this.notify) {
        this.notify(displayMessage, severity)
      }
    }

    return error
  }

  /**
   * Get a human-readable error message
   */
  static getErrorMessage(error: unknown, context: string): string {
    if (error && typeof error === 'object' && 'message' in error) {
      const msg = (error as ErrorLike).message
      if (msg) {
        return `${context}失败: ${msg}`
      }
    }
    return `${context}失败`
  }

  /**
   * Handle network request errors
   */
  static handleNetworkError(error: unknown, context = '网络请求'): unknown {
    let customMessage: string | null = null

    if (error && typeof error === 'object') {
      const err = error as ErrorLike
      if (err.code === 'NETWORK_ERROR') {
        customMessage = '网络连接失败，请检查网络设置'
      } else if (err.status === 401) {
        customMessage = '认证失败，请重新登录'
      } else if (err.status === 403) {
        customMessage = '权限不足，无法执行此操作'
      } else if (err.status === 404) {
        customMessage = '请求的资源不存在'
      } else if (err.status && err.status >= 500) {
        customMessage = '服务器错误，请稍后重试'
      }
    }

    return this.handleError(error, context, { customMessage })
  }

  /**
   * Handle chat-related errors
   */
  static handleChatError(error: unknown, operation: string): unknown {
    const context =
      CHAT_CONTEXT_MAP[operation as ChatOperation] ?? operation
    return this.handleError(error, context)
  }

  /**
   * Handle validation errors
   */
  static handleValidationError(message: string): unknown {
    return this.handleError(new Error(message), '输入验证', {
      severity: 'warning',
      customMessage: message
    })
  }

  /**
   * Handle async operation errors
   */
  static async handleAsync<T>(
    asyncFn: () => Promise<T>,
    context: string,
    options: ErrorHandlerOptions = {}
  ): Promise<T> {
    try {
      return await asyncFn()
    } catch (error) {
      this.handleError(error, context, options)
      throw error
    }
  }

  /**
   * Create an error handler bound to a specific context
   */
  static createHandler(
    context: string,
    options: ErrorHandlerOptions = {}
  ): (error: unknown) => unknown {
    return (error: unknown) => this.handleError(error, context, options)
  }
}

/** Shorthand for ErrorHandler.handleChatError */
export const handleChatError = ErrorHandler.handleChatError.bind(ErrorHandler)
/** Shorthand for ErrorHandler.handleNetworkError */
export const handleNetworkError = ErrorHandler.handleNetworkError.bind(ErrorHandler)
/** Shorthand for ErrorHandler.handleValidationError */
export const handleValidationError = ErrorHandler.handleValidationError.bind(ErrorHandler)
/** Shorthand for ErrorHandler.handleAsync */
export const handleAsync = ErrorHandler.handleAsync.bind(ErrorHandler)

export default ErrorHandler