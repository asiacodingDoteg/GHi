export class SerialHandler {
  constructor() {
    this.port = null
    this.reader = null
    this.writer = null
    this.isConnected = false
    this.onDataCallback = null
    this.onConnectCallback = null
    this.onDisconnectCallback = null
    this.isReading = false
  }

  onData(callback) {
    this.onDataCallback = callback
  }

  onConnect(callback) {
    this.onConnectCallback = callback
  }

  onDisconnect(callback) {
    this.onDisconnectCallback = callback
  }

  async initialize() {
    try {
      if (!navigator.serial) {
        console.log('Web Serial API not available. Using mock data.')
        return false
      }

      this.port = await navigator.serial.requestPort()
      await this.connect()
      return true
    } catch (error) {
      console.log('Serial port selection cancelled or error:', error.message)
      return false
    }
  }

  async connect() {
    try {
      if (!this.port) return false

      await this.port.open({ baudRate: 9600 })
      this.isConnected = true
      
      if (this.onConnectCallback) {
        this.onConnectCallback()
      }

      this.startReading()
      return true
    } catch (error) {
      console.error('Failed to connect to serial port:', error)
      this.isConnected = false
      return false
    }
  }

  async startReading() {
    if (!this.port || this.isReading) return

    this.isReading = true

    try {
      const textDecoder = new TextDecoderStream()
      const readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable)
      this.reader = textDecoder.readable.getReader()

      let buffer = ''

      while (true) {
        const { value, done } = await this.reader.read()
        
        if (done) {
          this.reader.releaseLock()
          break
        }

        buffer += value

        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
          const trimmedLine = line.trim()
          if (trimmedLine) {
            try {
              if (this.onDataCallback) {
                this.onDataCallback(trimmedLine)
              }
            } catch (error) {
              console.error('Error processing serial data:', error)
            }
          }
        }
      }

      await readableStreamClosed.catch(() => {})
    } catch (error) {
      console.error('Serial reading error:', error)
    } finally {
      this.isReading = false
      this.isConnected = false
      if (this.onDisconnectCallback) {
        this.onDisconnectCallback()
      }
    }
  }

  async disconnect() {
    if (this.reader) {
      this.reader.cancel()
      this.reader = null
    }

    if (this.port) {
      try {
        await this.port.close()
      } catch (error) {
        console.error('Error closing port:', error)
      }
      this.port = null
    }

    this.isConnected = false
    this.isReading = false
  }

  async sendData(data) {
    if (!this.port || !this.isConnected) {
      console.warn('Serial port not connected')
      return false
    }

    try {
      const writer = this.port.writable.getWriter()
      const encoder = new TextEncoder()
      await writer.write(encoder.encode(data + '\n'))
      writer.releaseLock()
      return true
    } catch (error) {
      console.error('Error sending data:', error)
      return false
    }
  }
}
