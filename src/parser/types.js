export const character = (stream) => stream.getCharacter();
export const uint8 = (stream) => stream.getUint8();
export const uint16 = (stream) => stream.getUint16();
export const uint32 = (stream) => stream.getUint32();
export const int8 = (stream) => stream.getInt8();
export const int16 = (stream) => stream.getInt16();
export const int32 = (stream) => stream.getInt32();
export const lengthPrefixedString = (stream) => stream.getLengthPrefixedString();
export const nullTerminatedString = maxLength => (stream) => stream.getNullTerminatedString(maxLength);
