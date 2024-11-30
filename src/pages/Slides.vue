<template>
  <Layout>
    <div class="max-w-5xl mx-auto px-4">
      <h1 class="text-3xl font-bold mb-6">Slide Generator</h1>

      <div class="flex flex-col gap-4 mb-8">
        <h2 class="text-xl font-semibold">Select Bulletin:</h2>
        <div class="overflow-x-scroll">
          <div class="flex gap-3 w-max">
            <div
              v-for="{ node } in bulletinsWithoutSlides"
              :key="node.id"
              class="py-2 border rounded hover:bg-gray-100 cursor-pointer text-center select-none w-1/4 flex-shrink-0"
              :class="{
                'bg-blue-100':
                  selectedBulletin && selectedBulletin.id === node.id,
              }"
              @click="selectBulletin(node)"
            >
              {{ node.date }}
            </div>
          </div>
        </div>

        <button
          @click="generateSlides"
          class="button is-primary is-outlined w-full mt-4"
          :disabled="!selectedBulletin"
        >
          Generate Slides
        </button>

        <button
          @click="openPdf"
          class="button is-primary is-outlined w-full mt-4 hover:bg-blue-700 border-blue-700"
          v-if="slideUrls.length > 0 && !generatingSlides"
        >
          Open PDF
        </button>
      </div>

      <div v-if="progressBar" class="mb-8">
        <p class="mb-2 text-center">
          {{ slideUrls.length > 0 ? 'Generating Slides...' : 'Loading PDF...' }}
        </p>
        <progress
          v-if="generatingSlides"
          max="100"
          :value="progress"
          class="w-full h-3 rounded-full bg-gray-200 overflow-hidden"
          style="appearance: none;"
        >
          <div
            class="h-full bg-blue-500 transition-all duration-300"
            :style="{ width: progress + '%' }"
          ></div>
        </progress>
      </div>

      <div v-if="slideUrls.length > 0 && !generatingSlides" class="mb-8">
        <div class="flex items-stretch h-[1200px] -mt-[600px]">
          <!-- Left Arrow -->
          <div
            @click="prevSlide"
            class="w-10 bg-gray-800 text-white mx-0 px-0 hover:bg-gray-700 rounded-l-full flex items-center justify-center"
            :class="{
              'cursor-not-allowed': currentSlideIndex === 0,
              'opacity-50': currentSlideIndex === 0,
            }"
          >
            <span class="text-2xl select-none">←</span>
          </div>

          <!-- Slide Display -->
          <div class="relative flex-1 border px-0 mx-0">
            <img
              :src="slideUrls[currentSlideIndex]"
              class="w-full h-full object-contain"
              alt="Slide"
            />
            <div class="absolute bottom-4 w-full flex justify-center z-10">
              <span
                class="bg-gray-800 text-white px-4 py-2 -mt-6 rounded-full text-lg shadow-lg"
              >
                {{ currentSlideIndex + 1 }} / {{ slideUrls.length }}
              </span>
            </div>
          </div>

          <!-- Right Arrow -->
          <div
            @click="nextSlide"
            class="w-10 bg-gray-800 text-white hover:bg-gray-700 rounded-r-full flex items-center justify-center"
            :class="{
              'cursor-not-allowed': currentSlideIndex === slideUrls.length - 1,
              'opacity-50': currentSlideIndex === slideUrls.length - 1,
            }"
          >
            <span class="text-2xl select-none">→</span>
          </div>
        </div>

        <!-- Edit Controls -->
        <div class="mt-8 p-6 border rounded-lg bg-gray-50">
          <h3 class="text-lg font-semibold mb-4">Edit Current Slide</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Type</label>
              <select
                v-model="slideEdits[currentSlideIndex].type"
                class="w-full p-2 border rounded"
                @change="handleTypeChange"
              >
                <option value="scripture">Scripture</option>
                <option value="hymn">Hymn</option>
                <option value="insert">Insert</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Title</label>
              <input
                v-model="slideEdits[currentSlideIndex].title"
                class="w-full p-2 border rounded"
                @change="updateSlide"
              />
            </div>

            <div v-if="slideEdits[currentSlideIndex].type === 'insert'">
              <label class="block text-sm font-medium mb-2">License</label>
              <input
                v-model="slideEdits[currentSlideIndex].license"
                class="w-full p-2 border rounded"
                @change="updateSlide"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2 w-full relative">
                Content
              </label>

              <div class="relative">
                <textarea
                  v-model="slideEdits[currentSlideIndex].content"
                  class="w-full p-2 border rounded h-32"
                  @change="updateSlide"
                ></textarea>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <button
                @click="updateSlide"
                class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update Slide
              </button>
              <button
                @click="addNewSlide"
                class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Insert Slide
              </button>
              <button
                @click="deleteSlide"
                class="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Slide
              </button>
              <button
                @click="viewSource"
                class="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                :class="{
                  'cursor-not-allowed':
                    slideEdits[currentSlideIndex].type === 'insert',
                  'opacity-50': slideEdits[currentSlideIndex].type === 'insert',
                }"
              >
                View Source
              </button>
            </div>
          </div>
        </div>

        <button
          @click="downloadAllSlides"
          class="button is-primary is-outlined w-full mt-4 hover:bg-green-700 border-green-700"
        >
          Download All Slides
        </button>
      </div>
    </div>
  </Layout>
</template>

<page-query>
query {
  bulletins: allBulletin(sortBy: "date") {
    edges {
      node {
        id
        title
        date(format: "MM/DD/YY")
        url
      }
    }
  }
  sermons: allSermon {
    edges {
      node {
        date(format: "MM/DD/YY")
      }
    }
  }
}
</page-query>
<script>
import axios from 'axios'
import { createCanvas, loadImage } from 'canvas'
import * as pdfjsLib from 'pdfjs-dist'
import JSZip from 'jszip'

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export default {
  data() {
    return {
      selectedBulletin: null,
      generatingSlides: false,
      hymnData: {},
      progressBar: false,
      progress: 0,
      slideUrls: [],
      currentSlideIndex: 0,
      slideEdits: [],
      logoImage: null,
    }
  },
  computed: {
    bulletinsWithoutSlides() {
      // Get all bulletins sorted by date (most recent first)
      const sortedBulletins = [...this.$page.bulletins.edges].sort((a, b) => {
        return new Date(b.node.date) - new Date(a.node.date)
      })

      // Return only the two most recent bulletins
      return sortedBulletins.slice(0, 30)
    },
  },
  mounted() {
    this.loadCustomFont('Calibri', '/text.ttf')
    this.loadCustomFont('Calibri Bold', '/bold.ttf')
    window.addEventListener('keydown', this.handleKeyboard)
    this.loadLogo()
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyboard)
  },
  methods: {
    handleKeyboard(event) {
      const activeElement = document.activeElement
      const isInputFocused =
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA'

      if (
        !isInputFocused &&
        !this.generatingSlides &&
        this.slideUrls.length > 0
      ) {
        if (event.key === 'ArrowRight') {
          this.nextSlide()
        } else if (event.key === 'ArrowLeft') {
          this.prevSlide()
        }
      }
    },
    selectBulletin(bulletin) {
      this.selectedBulletin = bulletin
      this.slideUrls = []
      this.slideEdits = []
      this.currentSlideIndex = 0
    },
    nextSlide() {
      if (this.currentSlideIndex < this.slideUrls.length - 1) {
        this.currentSlideIndex++
      }
    },
    prevSlide() {
      if (this.currentSlideIndex > 0) {
        this.currentSlideIndex--
      }
    },
    async renderSlide(title, content, isHymn = false, license = '') {
      const canvas = this.recreateCanvas()
      const ctx = canvas.getContext('2d')

      // Format title with superscript numbers
      const formattedTitle = title
        .replace(/\[(\d+)\]/g, '^$1')
        .replace(/\+/g, ' ')
        .trim()

      // Helper function to add standard slide elements
      const addStandardElements = async (ctx) => {
        // Add title
        ctx.font = '72px Calibri Bold'
        ctx.fillStyle = 'black'
        ctx.fillText(formattedTitle, 145, 113)

        // Add logo
        if (this.logoImage) {
          ctx.drawImage(this.logoImage, 1300, 850, 556, 156)
        }

        // Add license text if provided
        ctx.font = '22px Calibri'
        // Add CCLI if hymn
        if (isHymn) {
          ctx.fillText('CCLI License #2848460', 1510, 1000)
          if (license) {
            ctx.fillText(license, 270, 990)
          }
        }
      }

      await addStandardElements(ctx)

      // If no content, return single slide with just title and standard elements
      if (!content) {
        return {
          slides: [canvas.toDataURL('image/png')],
          count: 1,
        }
      }

      // Handle content line wrapping
      const maxWidth = 1530
      let y = 173
      let lines = []
      let currentLine = []
      let currentIndent = 0
      let lastLineWasBlank = false // Track if last line was blank
      let lineNumber = 0 // Track line number

      console.log('Content:', content)
      // If content is an array, replace double newlines with single newlines
      if (Array.isArray(content)) {
        content = content.map((line) => line.replace(/\n\n/g, '\n'))
      }

      const processedContent = Array.isArray(content)
        ? content.join('\n').replace(/\[(\d+)\]/g, (match, num) => `^${num}`)
        : String(content || '').replace(/\[(\d+)\]/g, (match, num) => `^${num}`)

      console.log('Processed content:', processedContent)

      // Split on actual newlines first, then split words within each line
      const contentLines = processedContent.split('\n')
      let estimatedY = y // Track estimated Y position for width calculations

      for (const contentLine of contentLines) {
        lineNumber++ // Increment line counter

        // Check if line is blank
        if (contentLine.trim().length === 0) {
          lastLineWasBlank = true
          continue
        }

        // Preserve leading spaces for indentation
        const leadingSpaces = contentLine.match(/^\s*/)[0].length
        const words = contentLine.trim().split(/\s+/)
        currentIndent = leadingSpaces

        // Calculate line breaks
        let lineWidth = leadingSpaces * ctx.measureText(' ').width
        for (const word of words) {
          const isSuperscript = word.startsWith('^')
          ctx.font = isSuperscript ? '52px Calibri Bold' : '72px Calibri Bold'
          // For superscripts, only measure the actual number part
          const wordWidth = isSuperscript
            ? ctx.measureText(word.substring(1) + ' ').width // Scale down superscript width
            : ctx.measureText(word + ' ').width

          // Adjust max width based on estimated Y position
          const effectiveMaxWidth = estimatedY > 850 ? 1050 : 1530

          if (lineWidth + wordWidth > effectiveMaxWidth) {
            lines.push({
              text: currentLine.join(' '),
              indent: currentIndent,
              lineNumber,
              wasBlank: lastLineWasBlank,
            })
            lastLineWasBlank = false
            currentLine = [word]
            lineWidth = leadingSpaces * ctx.measureText(' ').width + wordWidth
            estimatedY += lastLineWasBlank ? 114 : 76
            if (estimatedY > 900) {
              estimatedY = 203
            }
          } else {
            currentLine.push(word)
            lineWidth += wordWidth
          }
        }

        if (currentLine.length > 0) {
          lines.push({
            text: currentLine.join(' '),
            indent: currentIndent,
            wasBlank: lastLineWasBlank,
            lineNumber,
          })
          lastLineWasBlank = false
          currentLine = []
          estimatedY += lastLineWasBlank ? 114 : 76
          if (estimatedY > 900) {
            estimatedY = 203
          }
        }
      }

      // Render lines with overflow handling
      const renderedSlides = []
      let currentCtx = ctx
      let currentCanvas = canvas
      let linesProcessed = 0

      console.log('Lines:', lines)

      while (linesProcessed < lines.length) {
        y = 203

        while (y <= 900 && linesProcessed < lines.length) {
          const { text: line, indent, wasBlank, lineNumber } = lines[
            linesProcessed
          ]

          // Start new slide if line number > 4 and two blank lines in a row
          if (y > 600 && wasBlank) {
            break
          }

          // Add extra spacing if previous line was blank
          if (wasBlank && y > 203) {
            y += 76 // Half the normal line height for blank line spacing
          }

          // Split line into regular text and superscript numbers
          const parts = line.split(/(\^[0-9]+)/).filter(Boolean)
          let x = 270 + indent * ctx.measureText(' ').width

          for (const part of parts) {
            if (part.startsWith('^')) {
              const num = part.substring(1)
              currentCtx.font = '52px Calibri Bold'
              currentCtx.fillStyle = 'dimgray'
              currentCtx.fillText(num, x, y - 20) // Move superscript higher
              x += currentCtx.measureText(num).width // Scale down superscript spacing
            } else {
              currentCtx.font = '72px Calibri Bold'
              currentCtx.fillStyle = 'black'
              currentCtx.fillText(part, x, y)
              x += currentCtx.measureText(part).width
            }
          }

          y += 76
          linesProcessed++
        }

        renderedSlides.push(currentCanvas.toDataURL('image/png'))

        if (linesProcessed < lines.length) {
          currentCanvas = this.recreateCanvas()
          currentCtx = currentCanvas.getContext('2d')
          await addStandardElements(currentCtx)
        }
      }

      return {
        slides: renderedSlides,
        count: renderedSlides.length,
      }
    },
    updateSlide() {
      const edit = this.slideEdits[this.currentSlideIndex]
      const isHymn = edit.type === 'hymn' || edit.type === 'insert'

      // Get current slide group start index
      let startIndex = this.currentSlideIndex
      while (
        startIndex > 0 &&
        this.slideEdits[startIndex - 1].title === edit.title
      ) {
        startIndex--
      }

      // Remove all slides in current group
      let endIndex = startIndex
      while (
        endIndex < this.slideUrls.length &&
        this.slideEdits[endIndex].title === edit.title
      ) {
        endIndex++
      }

      this.renderSlide(
        edit.title.replace('+', ' '),
        edit.content,
        isHymn,
        edit.license
      ).then(({ slides, count }) => {
        // Replace all slides in group with new rendered slides
        this.slideUrls.splice(startIndex, endIndex - startIndex, ...slides)
        this.slideEdits.splice(startIndex, endIndex - startIndex)

        // Add edit data for each new slide
        for (let i = 0; i < count; i++) {
          this.slideEdits.splice(startIndex + i, 0, { ...edit })
        }

        // Adjust current slide index if needed
        if (this.currentSlideIndex >= startIndex + count) {
          this.currentSlideIndex = startIndex + count - 1
        }
      })
    },
    deleteSlide() {
      this.slideUrls.splice(this.currentSlideIndex, 1)
      this.slideEdits.splice(this.currentSlideIndex, 1)
      if (this.currentSlideIndex >= this.slideUrls.length) {
        this.currentSlideIndex = Math.max(0, this.slideUrls.length - 1)
      }
    },
    addNewSlide() {
      this.renderSlide('New Slide', '').then(({ slides }) => {
        this.slideUrls.splice(this.currentSlideIndex + 1, 0, slides[0])
        this.slideEdits.splice(this.currentSlideIndex + 1, 0, {
          type: 'scripture',
          title: 'New Slide',
          content: '',
          license: '',
        })
        this.currentSlideIndex++
      })
    },
    viewSource() {
      const edit = this.slideEdits[this.currentSlideIndex]
      if (edit.type === 'scripture') {
        window.open(
          `https://esv.org/${edit.title.replace(/\s+/g, '+')}`,
          '_blank'
        )
      } else if (edit.type === 'hymn') {
        const number = edit.title.match(/^\d+/)?.[0]
        if (number) {
          window.open(`https://hymnary.org/hymn/TH1990/${number}`, '_blank')
        }
      }
    },
    async downloadAllSlides() {
      const zip = new JSZip()

      this.slideUrls.forEach((url, index) => {
        // Convert base64 image URL to blob
        const imageData = url.split(',')[1]
        zip.file(`Slide ${index + 1}.png`, imageData, { base64: true })
      })

      const content = await zip.generateAsync({ type: 'blob' })
      const downloadUrl = URL.createObjectURL(content)

      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `Slides ${this.selectedBulletin.title.replace(
        'Bulletin ',
        ''
      )}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(downloadUrl)
    },
    openPdf() {
      window.open(this.selectedBulletin.url, '_blank')
    },
    handleTypeChange() {
      this.updateSlide()
    },
    recreateCanvas() {
      const canvas = createCanvas(1920, 1080)
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, 1920, 1080)
      return canvas
    },
    async generateSlides() {
      if (!this.selectedBulletin) return

      this.progressBar = true
      this.progress = 0
      this.slideUrls = []
      this.slideEdits = []
      const id = this.selectedBulletin.url.split('/')[5]

      try {
        // Convert Google Drive view URL to direct download URL
        // let pdfUrl =
        //   'https://cors.blazenetworking.com/' +
        //   this.selectedBulletin.url
        //     .replace('/view', '')
        //     .replace(
        //       'https://drive.google.com/file/d/',
        //       'https://drive.google.com/uc?export=download&id='
        //     )
        let pdfUrl =
          'https://www.googleapis.com/drive/v3/files/' +
          id +
          '?key=AIzaSyBzJo2OBvw-FL-Way0Z-Z4nL1R7SchyIYs&alt=media&source=downloadUrl'
        const pdfResponse = await axios.get(pdfUrl, {
          responseType: 'arraybuffer',
        })
        const pdfData = new Uint8Array(pdfResponse.data)

        // Extract links from the PDF
        const loadingTask = pdfjsLib.getDocument({
          data: pdfData,
          verbosity: 0,
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.12.313/cmaps/',
          cMapPacked: true,
        })
        const pdf = await loadingTask.promise
        const page = await pdf.getPage(1)
        const annotations = await page.getAnnotations()
        const links = annotations
          .filter(
            (annotation) => annotation.subtype === 'Link' && annotation.url
          )
          .map((annotation) => annotation.url)
          .filter(
            (url) => url.includes('hymnary.org') || url.includes('esv.org')
          )
          .map((url) => {
            const final = url.endsWith('/') ? url.slice(0, -1) : url
            return final.split('/').pop()
          })

        // Look for "Insert" text in the PDF and find positions relative to links
        const items = (await page.getTextContent()).items
          .filter((item) => item.str.trim())
          .map((item) => item.str.replace('  ', ' '))

        // Find all hymn/verse references and their positions
        const referencePositions = []
        items.forEach((item, index) => {
          if (links.includes(item)) {
            referencePositions.push({ ref: item, pos: index })
          }
        })

        // Find inserts and their positions
        const inserts = []
        for (let i = 0; i < items.length; i++) {
          if (items[i].toLowerCase().includes('insert')) {
            if (i + 2 < items.length) {
              // Find closest reference before this insert
              const prevRef = referencePositions
                .filter((rp) => rp.pos < i)
                .pop()

              inserts.push({
                afterRef: prevRef ? prevRef.ref : null,
                title: items[i + 1].replace(/\s+/g, ' '),
                license: items[i + 2],
              })
            }
          }
        }
        console.log('Found inserts with positions:', inserts)

        // Generate slides for each link
        this.generatingSlides = true
        for (const [index, link] of links.entries()) {
          if (link !== '731') {
            console.log('Slide generating for', link)
            const isHymn = link.match(/^\d+$/)
            let content, title
            if (isHymn) {
              const hymnData = await this.getHymnText(link)
              content = hymnData[1]
              title = hymnData[0]
            } else {
              content = await this.getVerseText(link)
              title = link.replace('+', ' ').replace('%20', ' ')
            }

            if (content) {
              const { slides } = await this.renderSlide(title, content, isHymn)
              this.slideUrls.push(...slides)
              // Create edit data for each slide
              slides.forEach(() => {
                this.slideEdits.push({
                  type: isHymn ? 'hymn' : 'scripture',
                  title: title,
                  content: content || '',
                  license: '',
                })
              })

              // Check if there are any inserts that should come after this link
              const insertsAfterLink = inserts.filter(
                (insert) => insert.afterRef === link
              )
              for (const insert of insertsAfterLink) {
                console.log('Insert found:', insert)
                const { slides } = await this.renderSlide(
                  insert.title,
                  '',
                  true,
                  insert.license
                )
                console.log('Slides:', slides)
                this.slideUrls.push(...slides)
                slides.forEach(() => {
                  this.slideEdits.push({
                    type: 'insert',
                    title: insert.title,
                    content:
                      'To get lyrics, try hymnary.org, hymnlyrics.com, or genius.com and cross reference them against the bulletin PDF.',
                    license: insert.license,
                  })
                })
              }
            }
          }
          this.progress = Math.round(((index + 1) / links.length) * 100)
        }

        console.log('Slides generated successfully!')
      } catch (error) {
        console.error('Error generating slides:', error)
      } finally {
        this.generatingSlides = false
        this.progressBar = false
      }
    },
    async getVerseText(reference) {
      // Fetch verse text from ESV API
      let url = `https://api.esv.org/v3/passage/text/?q=${reference}`
      // if (process.env.NODE_ENV === 'development') {
      //   url = 'http://localhost:3002/?url=' + url
      // }
      const response = await axios.get(url, {
        headers: {
          Authorization: `Token 7666776cfaa6506622312a1ff55344c117bb9f66`,
          Accept: '*/*',
        },
        params: {
          'include-footnote-body': false,
          'include-footnotes': false,
          'include-headings': false,
          'include-passage-references': false,
        },
      })

      let final = response.data.passages[0].replace(' (ESV)', '')
      final = final.replace(/(\n\s*){2,}/g, '\n')
      return final
    },
    async getHymnText(number) {
      try {
        // Fetch hymns.json if not already loaded
        if (!this.hymnsData) {
          const response = await axios.get('/hymns.json')
          this.hymnsData = response.data
        }

        // Get hymn from loaded data
        const hymn = this.hymnsData[number]
        if (!hymn) {
          return [number, ''] // Return empty if hymn not found
        }

        const title = hymn.title
        const verses = hymn.verses

        // Format verses with double newlines between them
        const formattedVerses = verses
          .map((verse) => verse.join('\n'))
          .join('\n\n')

        return [title, formattedVerses]
      } catch (error) {
        console.error('Error loading hymn:', error)
        return [number, '']
      }
    },
    async loadCustomFont(fontName, fontUrl) {
      const font = new FontFace(fontName, `url(${fontUrl})`)
      await font.load()
      document.fonts.add(font)
    },
    async loadLogo() {
      try {
        this.logoImage = await loadImage('logo.png')
      } catch (err) {
        console.error('Error loading logo:', err)
      }
    },
  },
}
</script>
