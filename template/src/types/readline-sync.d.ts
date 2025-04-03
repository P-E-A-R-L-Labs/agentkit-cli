// Type definitions for readline-sync 1.4
// Project: https://github.com/anseki/readline-sync
// Definitions by: Custom TypeScript Definitions

declare module 'readline-sync' {
    export interface BasicOptions {
      /**
       * Prompt string. Default: ''
       */
      prompt?: string;
      /**
       * String to be used as prompt for hidden input. Default: '[hidden]'
       */
      hideEchoBack?: boolean;
      /**
       * Hides the prompt strings and the input. Default: false
       */
      mask?: string | boolean;
      /**
       * Limits the number of attempts to get valid input. Default: Infinity
       */
      limit?: number;
      /**
       * Behavior of the limit feature. Default: false
       */
      limitMessage?: string | boolean;
      /**
       * Default input value. Default: ''
       */
      defaultInput?: string;
      /**
       * Maximum length of input. Default: Infinity
       */
      charLimit?: number;
      /**
       * Character to be used as a terminator. Default: LF (U+000A)
       */
      eot?: boolean;
      /**
       * Behavior of the eot feature. Default: false
       */
      trueValue?: string | RegExp;
      /**
       * Values to be interpret as true. Default: /^(y|yes|ok|true)$/i
       */
      falseValue?: string | RegExp;
      /**
       * Values to be interpret as false. Default: /^(n|no|cancel|false)$/i
       */
      caseSensitive?: boolean;
      /**
       * Disable the case sensitivity of input. Default: false
       */
      encoding?: string;
      /**
       * Encoding method of the input. Default: 'utf8'
       */
      bufferSize?: number;
      /**
       * Size of buffer. Default: 1024
       */
      print?: (display: string, encoding: string) => void;
      /**
       * Function to print the prompt. Default: process.stdout.write
       */
      history?: boolean;
      /**
       * Keep a history of the entered commands. Default: true
       */
      cd?: boolean;
      /**
       * Register 'cd' command. Default: false
       */
    }
  
    export interface PromptOptions extends BasicOptions {
      /**
       * Behavior of the strip feature. Default: true
       */
      keepWhitespace?: boolean;
      /**
       * Replace a display text with a replacement text. Default: undefined
       */
      replace?: { [text: string]: string };
    }
  
    export interface QuestionOptions extends PromptOptions {
      /**
       * Behavior of the trim feature. Default: true
       */
      trim?: boolean;
    }
  
    export interface KeyInOptions extends BasicOptions {
      /**
       * List of keys that can be pressed. Default: undefined
       */
      limit?: string;
      /**
       * Function to validate the key. Default: undefined
       */
      limitMessage?: string | ((key: string) => boolean);
    }
  
    export interface ReadLineOptions {
      /**
       * Encoding method of the input. Default: 'utf8'
       */
      encoding?: string;
      /**
       * Function to print the prompt. Default: process.stdout.write
       */
      print?: (display: string, encoding: string) => void;
    }
  
    // Main Functions
    export function question(query?: string, options?: QuestionOptions): string;
    export function questionEMail(query?: string, options?: QuestionOptions): string;
    export function questionInt(query?: string, options?: QuestionOptions): number;
    export function questionFloat(query?: string, options?: QuestionOptions): number;
    export function questionPath(query?: string, options?: QuestionOptions): string;
    export function prompt(options?: PromptOptions): string;
    export function promptCL(options?: PromptOptions): string;
    export function promptLoop(handler: (input: string) => boolean, options?: PromptOptions): void;
    export function promptSimShell(options?: PromptOptions): string;
    export function promptValidate(handler: (input: string) => boolean, options?: PromptOptions): string;
    export function setDefaultOptions(options: BasicOptions): void;
  
    // keyIn Functions
    export function keyIn(query?: string, options?: KeyInOptions): string;
    export function keyInPause(query?: string, options?: KeyInOptions): string;
    export function keyInSelect(items: string[], query?: string, options?: KeyInOptions): number;
    export function keyInYN(query?: string, options?: KeyInOptions): boolean;
    export function keyInYNStrict(query?: string, options?: KeyInOptions): boolean;
  
    // Additional Functions
    export function getHistory(): string[];
    export function clearHistory(): void;
    export function setHistory(history: string[]): void;
    export function setPrint(print: (display: string, encoding: string) => void): void;
  
    // Utility Functions
    export function isBlank(input: string): boolean;
    export function isEOF(input: string): boolean;
    export function isValid(input: string, options?: QuestionOptions): boolean;
    export function parseCmd(input: string): { [key: string]: string };
  }