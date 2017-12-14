import * as os from 'os';
import { Platform } from "./constants";

export function GetKey(keycode: number): KeyCode {
  return KEY_CODE_MAP[keycode];
}

let KEY_CODE_MAP: { [keyCode: number]: KeyCode } = {};
(function () {
  KEY_CODE_MAP[3] = KeyCode.PauseBreak; // VK_CANCEL 0x03 Control-break processing
  KEY_CODE_MAP[8] = KeyCode.Backspace;
  KEY_CODE_MAP[9] = KeyCode.Tab;
  KEY_CODE_MAP[13] = KeyCode.Enter;
  KEY_CODE_MAP[16] = KeyCode.Shift;
  KEY_CODE_MAP[17] = KeyCode.Ctrl;
  KEY_CODE_MAP[18] = KeyCode.Alt;
  KEY_CODE_MAP[19] = KeyCode.PauseBreak;
  KEY_CODE_MAP[20] = KeyCode.CapsLock;
  KEY_CODE_MAP[27] = KeyCode.Escape;
  KEY_CODE_MAP[32] = KeyCode.Space;
  KEY_CODE_MAP[33] = KeyCode.PageUp;
  KEY_CODE_MAP[34] = KeyCode.PageDown;
  KEY_CODE_MAP[35] = KeyCode.End;
  KEY_CODE_MAP[36] = KeyCode.Home;
  KEY_CODE_MAP[37] = KeyCode.LeftArrow;
  KEY_CODE_MAP[38] = KeyCode.UpArrow;
  KEY_CODE_MAP[39] = KeyCode.RightArrow;
  KEY_CODE_MAP[40] = KeyCode.DownArrow;
  KEY_CODE_MAP[45] = KeyCode.Insert;
  KEY_CODE_MAP[46] = KeyCode.Delete;

  KEY_CODE_MAP[48] = KeyCode.KEY_0;
  KEY_CODE_MAP[49] = KeyCode.KEY_1;
  KEY_CODE_MAP[50] = KeyCode.KEY_2;
  KEY_CODE_MAP[51] = KeyCode.KEY_3;
  KEY_CODE_MAP[52] = KeyCode.KEY_4;
  KEY_CODE_MAP[53] = KeyCode.KEY_5;
  KEY_CODE_MAP[54] = KeyCode.KEY_6;
  KEY_CODE_MAP[55] = KeyCode.KEY_7;
  KEY_CODE_MAP[56] = KeyCode.KEY_8;
  KEY_CODE_MAP[57] = KeyCode.KEY_9;

  KEY_CODE_MAP[65] = KeyCode.KEY_A;
  KEY_CODE_MAP[66] = KeyCode.KEY_B;
  KEY_CODE_MAP[67] = KeyCode.KEY_C;
  KEY_CODE_MAP[68] = KeyCode.KEY_D;
  KEY_CODE_MAP[69] = KeyCode.KEY_E;
  KEY_CODE_MAP[70] = KeyCode.KEY_F;
  KEY_CODE_MAP[71] = KeyCode.KEY_G;
  KEY_CODE_MAP[72] = KeyCode.KEY_H;
  KEY_CODE_MAP[73] = KeyCode.KEY_I;
  KEY_CODE_MAP[74] = KeyCode.KEY_J;
  KEY_CODE_MAP[75] = KeyCode.KEY_K;
  KEY_CODE_MAP[76] = KeyCode.KEY_L;
  KEY_CODE_MAP[77] = KeyCode.KEY_M;
  KEY_CODE_MAP[78] = KeyCode.KEY_N;
  KEY_CODE_MAP[79] = KeyCode.KEY_O;
  KEY_CODE_MAP[80] = KeyCode.KEY_P;
  KEY_CODE_MAP[81] = KeyCode.KEY_Q;
  KEY_CODE_MAP[82] = KeyCode.KEY_R;
  KEY_CODE_MAP[83] = KeyCode.KEY_S;
  KEY_CODE_MAP[84] = KeyCode.KEY_T;
  KEY_CODE_MAP[85] = KeyCode.KEY_U;
  KEY_CODE_MAP[86] = KeyCode.KEY_V;
  KEY_CODE_MAP[87] = KeyCode.KEY_W;
  KEY_CODE_MAP[88] = KeyCode.KEY_X;
  KEY_CODE_MAP[89] = KeyCode.KEY_Y;
  KEY_CODE_MAP[90] = KeyCode.KEY_Z;

  KEY_CODE_MAP[93] = KeyCode.ContextMenu;

  KEY_CODE_MAP[96] = KeyCode.NUMPAD_0;
  KEY_CODE_MAP[97] = KeyCode.NUMPAD_1;
  KEY_CODE_MAP[98] = KeyCode.NUMPAD_2;
  KEY_CODE_MAP[99] = KeyCode.NUMPAD_3;
  KEY_CODE_MAP[100] = KeyCode.NUMPAD_4;
  KEY_CODE_MAP[101] = KeyCode.NUMPAD_5;
  KEY_CODE_MAP[102] = KeyCode.NUMPAD_6;
  KEY_CODE_MAP[103] = KeyCode.NUMPAD_7;
  KEY_CODE_MAP[104] = KeyCode.NUMPAD_8;
  KEY_CODE_MAP[105] = KeyCode.NUMPAD_9;
  KEY_CODE_MAP[106] = KeyCode.NUMPAD_MULTIPLY;
  KEY_CODE_MAP[107] = KeyCode.NUMPAD_ADD;
  KEY_CODE_MAP[108] = KeyCode.NUMPAD_SEPARATOR;
  KEY_CODE_MAP[109] = KeyCode.NUMPAD_SUBTRACT;
  KEY_CODE_MAP[110] = KeyCode.NUMPAD_DECIMAL;
  KEY_CODE_MAP[111] = KeyCode.NUMPAD_DIVIDE;

  KEY_CODE_MAP[112] = KeyCode.F1;
  KEY_CODE_MAP[113] = KeyCode.F2;
  KEY_CODE_MAP[114] = KeyCode.F3;
  KEY_CODE_MAP[115] = KeyCode.F4;
  KEY_CODE_MAP[116] = KeyCode.F5;
  KEY_CODE_MAP[117] = KeyCode.F6;
  KEY_CODE_MAP[118] = KeyCode.F7;
  KEY_CODE_MAP[119] = KeyCode.F8;
  KEY_CODE_MAP[120] = KeyCode.F9;
  KEY_CODE_MAP[121] = KeyCode.F10;
  KEY_CODE_MAP[122] = KeyCode.F11;
  KEY_CODE_MAP[123] = KeyCode.F12;
  KEY_CODE_MAP[124] = KeyCode.F13;
  KEY_CODE_MAP[125] = KeyCode.F14;
  KEY_CODE_MAP[126] = KeyCode.F15;
  KEY_CODE_MAP[127] = KeyCode.F16;
  KEY_CODE_MAP[128] = KeyCode.F17;
  KEY_CODE_MAP[129] = KeyCode.F18;
  KEY_CODE_MAP[130] = KeyCode.F19;

  KEY_CODE_MAP[144] = KeyCode.NumLock;
  KEY_CODE_MAP[145] = KeyCode.ScrollLock;

  KEY_CODE_MAP[186] = KeyCode.US_SEMICOLON;
  KEY_CODE_MAP[187] = KeyCode.US_EQUAL;
  KEY_CODE_MAP[188] = KeyCode.US_COMMA;
  KEY_CODE_MAP[189] = KeyCode.US_MINUS;
  KEY_CODE_MAP[190] = KeyCode.US_DOT;
  KEY_CODE_MAP[191] = KeyCode.US_SLASH;
  KEY_CODE_MAP[192] = KeyCode.US_BACKTICK;
  KEY_CODE_MAP[193] = KeyCode.ABNT_C1;
  KEY_CODE_MAP[194] = KeyCode.ABNT_C2;
  KEY_CODE_MAP[219] = KeyCode.US_OPEN_SQUARE_BRACKET;
  KEY_CODE_MAP[220] = KeyCode.US_BACKSLASH;
  KEY_CODE_MAP[221] = KeyCode.US_CLOSE_SQUARE_BRACKET;
  KEY_CODE_MAP[222] = KeyCode.US_QUOTE;
  KEY_CODE_MAP[223] = KeyCode.OEM_8;

  KEY_CODE_MAP[226] = KeyCode.OEM_102;

	/**
	 * https://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
	 * If an Input Method Editor is processing key input and the event is keydown, return 229.
	 */
  KEY_CODE_MAP[229] = KeyCode.KEY_IN_COMPOSITION;

  KEY_CODE_MAP[91] = KeyCode.Meta;
  if (Platform) {
    // the two meta keys in the Mac have different key codes (91 and 93)
    KEY_CODE_MAP[93] = KeyCode.Meta;
  } else {
    KEY_CODE_MAP[92] = KeyCode.Meta;
  }
}) ();

export const enum KeyCode {
	/**
	 * Placed first to cover the 0 value of the enum.
	 */
  Unknown = 0,

  Backspace = 1,
  Tab = 2,
  Enter = 3,
  Shift = 4,
  Ctrl = 5,
  Alt = 6,
  PauseBreak = 7,
  CapsLock = 8,
  Escape = 9,
  Space = 10,
  PageUp = 11,
  PageDown = 12,
  End = 13,
  Home = 14,
  LeftArrow = 15,
  UpArrow = 16,
  RightArrow = 17,
  DownArrow = 18,
  Insert = 19,
  Delete = 20,

  KEY_0 = 21,
  KEY_1 = 22,
  KEY_2 = 23,
  KEY_3 = 24,
  KEY_4 = 25,
  KEY_5 = 26,
  KEY_6 = 27,
  KEY_7 = 28,
  KEY_8 = 29,
  KEY_9 = 30,

  KEY_A = 31,
  KEY_B = 32,
  KEY_C = 33,
  KEY_D = 34,
  KEY_E = 35,
  KEY_F = 36,
  KEY_G = 37,
  KEY_H = 38,
  KEY_I = 39,
  KEY_J = 40,
  KEY_K = 41,
  KEY_L = 42,
  KEY_M = 43,
  KEY_N = 44,
  KEY_O = 45,
  KEY_P = 46,
  KEY_Q = 47,
  KEY_R = 48,
  KEY_S = 49,
  KEY_T = 50,
  KEY_U = 51,
  KEY_V = 52,
  KEY_W = 53,
  KEY_X = 54,
  KEY_Y = 55,
  KEY_Z = 56,

  Meta = 57,
  ContextMenu = 58,

  F1 = 59,
  F2 = 60,
  F3 = 61,
  F4 = 62,
  F5 = 63,
  F6 = 64,
  F7 = 65,
  F8 = 66,
  F9 = 67,
  F10 = 68,
  F11 = 69,
  F12 = 70,
  F13 = 71,
  F14 = 72,
  F15 = 73,
  F16 = 74,
  F17 = 75,
  F18 = 76,
  F19 = 77,

  NumLock = 78,
  ScrollLock = 79,

	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 * For the US standard keyboard, the ';:' key
	 */
  US_SEMICOLON = 80,
	/**
	 * For any country/region, the '+' key
	 * For the US standard keyboard, the '=+' key
	 */
  US_EQUAL = 81,
	/**
	 * For any country/region, the ',' key
	 * For the US standard keyboard, the ',<' key
	 */
  US_COMMA = 82,
	/**
	 * For any country/region, the '-' key
	 * For the US standard keyboard, the '-_' key
	 */
  US_MINUS = 83,
	/**
	 * For any country/region, the '.' key
	 * For the US standard keyboard, the '.>' key
	 */
  US_DOT = 84,
	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 * For the US standard keyboard, the '/?' key
	 */
  US_SLASH = 85,
	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 * For the US standard keyboard, the '`~' key
	 */
  US_BACKTICK = 86,
	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 * For the US standard keyboard, the '[{' key
	 */
  US_OPEN_SQUARE_BRACKET = 87,
	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 * For the US standard keyboard, the '\|' key
	 */
  US_BACKSLASH = 88,
	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 * For the US standard keyboard, the ']}' key
	 */
  US_CLOSE_SQUARE_BRACKET = 89,
	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 * For the US standard keyboard, the ''"' key
	 */
  US_QUOTE = 90,
	/**
	 * Used for miscellaneous characters; it can vary by keyboard.
	 */
  OEM_8 = 91,
	/**
	 * Either the angle bracket key or the backslash key on the RT 102-key keyboard.
	 */
  OEM_102 = 92,

  NUMPAD_0 = 93, // VK_NUMPAD0, 0x60, Numeric keypad 0 key
  NUMPAD_1 = 94, // VK_NUMPAD1, 0x61, Numeric keypad 1 key
  NUMPAD_2 = 95, // VK_NUMPAD2, 0x62, Numeric keypad 2 key
  NUMPAD_3 = 96, // VK_NUMPAD3, 0x63, Numeric keypad 3 key
  NUMPAD_4 = 97, // VK_NUMPAD4, 0x64, Numeric keypad 4 key
  NUMPAD_5 = 98, // VK_NUMPAD5, 0x65, Numeric keypad 5 key
  NUMPAD_6 = 99, // VK_NUMPAD6, 0x66, Numeric keypad 6 key
  NUMPAD_7 = 100, // VK_NUMPAD7, 0x67, Numeric keypad 7 key
  NUMPAD_8 = 101, // VK_NUMPAD8, 0x68, Numeric keypad 8 key
  NUMPAD_9 = 102, // VK_NUMPAD9, 0x69, Numeric keypad 9 key

  NUMPAD_MULTIPLY = 103,	// VK_MULTIPLY, 0x6A, Multiply key
  NUMPAD_ADD = 104,		// VK_ADD, 0x6B, Add key
  NUMPAD_SEPARATOR = 105,	// VK_SEPARATOR, 0x6C, Separator key
  NUMPAD_SUBTRACT = 106,	// VK_SUBTRACT, 0x6D, Subtract key
  NUMPAD_DECIMAL = 107,	// VK_DECIMAL, 0x6E, Decimal key
  NUMPAD_DIVIDE = 108,	// VK_DIVIDE, 0x6F,

	/**
	 * Cover all key codes when IME is processing input.
	 */
  KEY_IN_COMPOSITION = 109,

  ABNT_C1 = 110, // Brazilian (ABNT) Keyboard
  ABNT_C2 = 111, // Brazilian (ABNT) Keyboard

	/**
	 * Placed last to cover the length of the enum.
	 * Please do not depend on this value!
	 */
  MAX_VALUE
}