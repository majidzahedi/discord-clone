function humanReadableSize(bytes: number, decimalPlaces: number = 2): string {
  // Define an array of size units for formatting
  const sizeUnits: string[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB']

  // Initialize unit index and set it to 0 for 'bytes'
  let unitIndex: number = 0

  // Convert bytes to the appropriate unit
  while (bytes >= 1024 && unitIndex < sizeUnits.length - 1) {
    bytes /= 1024
    unitIndex++
  }

  // Format the result with the specified number of decimal places
  const formattedSize: string = bytes.toFixed(decimalPlaces)

  // Construct the human-readable size string
  const result: string = `${formattedSize} ${sizeUnits[unitIndex]}`

  return result
}
export { humanReadableSize }
