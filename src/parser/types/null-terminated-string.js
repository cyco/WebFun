export default maxLength => (stream) =>stream.getNullTerminatedString(maxLength);