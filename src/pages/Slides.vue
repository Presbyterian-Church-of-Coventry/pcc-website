<template>
  <Layout>
    <div
      class="w-full"
      :class="pdfSidebarOpen ? 'flex items-start' : 'max-w-5xl mx-auto px-4'"
      :style="
        pdfSidebarOpen
          ? { minHeight: '100vh', width: '100%' }
          : null
      "
    >
      <!-- Full-height PDF column: pushes everything else right -->
      <aside
        v-if="pdfSidebarOpen"
        class="sticky top-0 flex-shrink-0 border-r bg-gray-100 flex flex-col"
        style="
          width: 42vw;
          min-width: 360px;
          max-width: 640px;
          height: 100vh;
        "
      >
        <div class="flex items-center justify-between px-3 py-2 border-b bg-white">
          <h3 class="text-sm font-semibold">Bulletin PDF</h3>
          <button
            type="button"
            @click="dismissPdfPanel"
            class="px-2 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded"
            title="Dismiss PDF panel"
          >
            ✕
          </button>
        </div>
        <div class="p-3 flex flex-col" style="flex: 1; min-height: 0;">
          <div
            class="relative w-full overflow-hidden bg-white border rounded"
            style="flex: 1; min-height: 0;"
          >
            <img
              :src="bulletinPageUrl"
              alt="Bulletin page"
              class="absolute top-0"
              :style="{
                height: '100%',
                width: '200%',
                maxWidth: 'none',
                left: pdfHalf === 0 ? '0' : '-100%',
                transition: 'left 0.2s ease',
              }"
            />
          </div>
          <div
            class="flex items-center justify-between mt-3 flex-shrink-0"
            style="gap: 0.5rem;"
          >
            <button
              type="button"
              @click="pdfHalf = 0"
              class="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-100"
              :class="{ 'opacity-50 cursor-not-allowed': pdfHalf === 0 }"
              :disabled="pdfHalf === 0"
            >
              ← Left
            </button>
            <span class="text-sm text-gray-600">{{ pdfHalf + 1 }} / 2</span>
            <button
              type="button"
              @click="pdfHalf = 1"
              class="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-100"
              :class="{ 'opacity-50 cursor-not-allowed': pdfHalf === 1 }"
              :disabled="pdfHalf === 1"
            >
              Right →
            </button>
          </div>
          <a
            v-if="selectedBulletin"
            :href="selectedBulletin.url"
            target="_blank"
            rel="noreferrer noopener"
            class="block mt-2 text-xs text-blue-700 hover:underline flex-shrink-0"
          >
            Open full PDF in new tab
          </a>
        </div>
      </aside>

      <!-- Entire page content (shifts right when PDF is open) -->
      <div
        :class="pdfSidebarOpen ? 'px-4 py-2' : ''"
        :style="
          pdfSidebarOpen
            ? { flex: '1 1 0%', minWidth: 0, maxWidth: '56rem' }
            : null
        "
      >
        <div
          v-if="showUpdatesBanner"
          class="mb-6 rounded border px-4 py-3 text-sm"
          style="
            background: #eff6ff;
            border-color: #bfdbfe;
            color: #1e3a5f;
          "
        >
          <strong>New Slide Generator updates</strong>
          — Live preview as you type, indent / unbold controls, 
          smarter verse layout, ↑↓ to reorder slides in the service,
          Show PDF for a side-by-side bulletin view. Improved 
          license box, and is better at detecting inserts. Please 
          look for insert text online and create insert slides within 
          this utility instead of creating custom Powerpoints. 
          Database of past insert texts and improved copyright data 
          for hymns coming soon. <strong>-Ben, 7/30/26</strong>
        </div>

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
            {{ showPdfPanel ? 'Hide PDF' : 'Show PDF' }}
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
          <div
            class="flex items-stretch"
            :class="pdfSidebarOpen ? '' : 'h-[1200px] -mt-[600px]'"
            :style="
              pdfSidebarOpen
                ? { height: 'min(70vh, 720px)' }
                : null
            "
          >
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
              <div class="absolute bottom-4 w-full flex justify-center z-10 gap-2">
                <button
                  type="button"
                  @click="moveSlideGroup(-1)"
                  class="bg-gray-800 text-white px-3 py-2 -mt-6 rounded-full text-lg shadow-lg hover:bg-gray-700"
                  :class="{
                    'cursor-not-allowed opacity-40': !canMoveSlideEarlier,
                  }"
                  :disabled="!canMoveSlideEarlier"
                  title="Move earlier in service order"
                  aria-label="Move earlier in service order"
                >
                  ↑
                </button>
                <span
                  class="bg-gray-800 text-white px-4 py-2 -mt-6 rounded-full text-lg shadow-lg"
                >
                  {{ currentSlideIndex + 1 }} / {{ slideUrls.length }}
                </span>
                <button
                  type="button"
                  @click="moveSlideGroup(1)"
                  class="bg-gray-800 text-white px-3 py-2 -mt-6 rounded-full text-lg shadow-lg hover:bg-gray-700"
                  :class="{
                    'cursor-not-allowed opacity-40': !canMoveSlideLater,
                  }"
                  :disabled="!canMoveSlideLater"
                  title="Move later in service order"
                  aria-label="Move later in service order"
                >
                  ↓
                </button>
              </div>
            </div>

            <!-- Right Arrow -->
            <div
              @click="nextSlide"
              class="w-10 bg-gray-800 text-white hover:bg-gray-700 rounded-r-full flex items-center justify-center"
              :class="{
                'cursor-not-allowed':
                  currentSlideIndex === slideUrls.length - 1,
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
                  @input="scheduleUpdate"
                />
              </div>

              <div
                v-if="
                  slideEdits[currentSlideIndex].type === 'insert' ||
                    slideEdits[currentSlideIndex].type === 'hymn'
                "
              >
                <label class="block text-sm font-medium mb-2">License</label>
                <input
                  v-model="slideEdits[currentSlideIndex].license"
                  class="w-full p-2 border rounded"
                  placeholder="© Writer / copyright info"
                  @input="scheduleUpdate"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-2 w-full relative">
                  Content
                </label>

                <div class="flex flex-wrap gap-2 mb-2">
                  <button
                    type="button"
                    @click="indentSelection"
                    class="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-100"
                    title="Indent line (Tab)"
                  >
                    Indent
                  </button>
                  <button
                    type="button"
                    @click="outdentSelection"
                    class="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-100"
                    title="Outdent line (Shift+Tab)"
                  >
                    Outdent
                  </button>
                  <button
                    type="button"
                    @click="unboldSelection"
                    class="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-100"
                    title="Unbold selection (**text**)"
                  >
                    Unbold
                  </button>
                </div>

                <div class="relative">
                  <textarea
                    ref="contentEditor"
                    v-model="slideEdits[currentSlideIndex].content"
                    class="w-full p-2 border rounded h-32 font-mono"
                    @input="scheduleUpdate"
                    @keydown="handleContentKeydown"
                  ></textarea>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  Tab / Shift+Tab to indent. Select text and click Unbold (or
                  wrap with **like this** — works across lines). Cmd/Ctrl+Z to
                  undo.
                </p>
              </div>

              <div class="grid grid-cols-3 gap-2 pt-2">
                <button
                  @click="viewSource"
                  class="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  :class="{
                    'cursor-not-allowed':
                      slideEdits[currentSlideIndex].type === 'insert',
                    'opacity-50':
                      slideEdits[currentSlideIndex].type === 'insert',
                  }"
                >
                  View Source
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
import dayjs from 'dayjs'
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
      updateTimer: null,
      // Minimum remaining words required before starting a new slide
      minWordsForNewSlide: 4,
      contentUndoStack: [],
      contentRedoStack: [],
      showPdfPanel: false,
      bulletinPageUrl: null,
      pdfHalf: 0,
      isWideScreen: false,
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
    canMoveSlideEarlier() {
      if (!this.slideEdits.length) return false
      const { start } = this.getSlideGroupRange(this.currentSlideIndex)
      return start > 0
    },
    canMoveSlideLater() {
      if (!this.slideEdits.length) return false
      const { end } = this.getSlideGroupRange(this.currentSlideIndex)
      return end < this.slideUrls.length
    },
    pdfSidebarOpen() {
      return !!(
        this.showPdfPanel &&
        this.bulletinPageUrl &&
        this.isWideScreen
      )
    },
    showUpdatesBanner() {
      // Announce slide-tool updates for about a month
      return dayjs().isBefore(dayjs('2026-08-30'))
    },
  },
  mounted() {
    this.loadCustomFont('Calibri', '/text.ttf')
    this.loadCustomFont('Calibri Bold', '/bold.ttf')
    window.addEventListener('keydown', this.handleKeyboard)
    window.addEventListener('resize', this.updateWideScreen)
    this.updateWideScreen()
    this.loadLogo()
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyboard)
    window.removeEventListener('resize', this.updateWideScreen)
    if (this.updateTimer) {
      clearTimeout(this.updateTimer)
    }
  },
  methods: {
    handleKeyboard(event) {
      const activeElement = document.activeElement
      const isInputFocused =
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA'

      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === 'z' &&
        this.slideUrls.length > 0 &&
        !this.generatingSlides
      ) {
        // Custom undo for toolbar edits (unbold/indent) which break native undo
        if (event.shiftKey) {
          if (this.redoContentEdit()) {
            event.preventDefault()
          }
        } else if (this.undoContentEdit()) {
          event.preventDefault()
        }
        // If no custom history, allow native undo in the textarea
        return
      }

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
    scheduleUpdate() {
      if (this.updateTimer) {
        clearTimeout(this.updateTimer)
      }
      this.updateTimer = setTimeout(() => {
        this.updateSlide()
      }, 280)
    },
    countRemainingWords(lines, fromIndex) {
      let count = 0
      for (let i = fromIndex; i < lines.length; i++) {
        const words = String(lines[i].text || '')
          .replace(/\*\*/g, '')
          .trim()
          .split(/\s+/)
          .filter(Boolean)
        count += words.length
      }
      return count
    },
    countStanzaLines(lines, fromIndex) {
      // Lines until the next blank-separated stanza (exclusive)
      let count = 0
      for (let i = fromIndex; i < lines.length; i++) {
        if (i > fromIndex && lines[i].wasBlank) break
        count++
      }
      return count
    },
    stanzaFitsOnSlide(y, wasBlank, stanzaLineCount) {
      let testY = y
      if (wasBlank && testY > 203) testY += 76
      testY += stanzaLineCount * 76
      return testY <= 900
    },
    shouldBlankBreakToNewSlide(y, wasBlank, nextStanzaFits) {
      // Blank = new stanza. Start a new slide only when that stanza won't fit
      // on the remaining space. That packs two 4-line verses per slide, keeps
      // short refrains with their verse, and still splits taller verses that
      // can't share (e.g. two 5-line stanzas).
      if (!wasBlank || y <= 203) return false
      return !nextStanzaFits
    },
    getLeadingIndent(contentLine) {
      // Tabs count as 4 indent units; spaces count as 1
      const leading = (contentLine.match(/^[\t ]*/) || [''])[0]
      return [...leading].reduce((n, c) => n + (c === '\t' ? 4 : 1), 0)
    },
    handleContentKeydown(event) {
      if (event.key === 'Tab') {
        event.preventDefault()
        if (event.shiftKey) {
          this.outdentSelection()
        } else {
          this.indentSelection()
        }
      } else if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === 'b'
      ) {
        event.preventDefault()
        this.unboldSelection()
      }
      // Cmd/Ctrl+Z handled in handleKeyboard so it works after toolbar button clicks
    },
    snapshotContentForUndo() {
      const edit = this.slideEdits[this.currentSlideIndex]
      if (!edit) return
      const ta = this.$refs.contentEditor
      const content = edit.content || ''
      const last = this.contentUndoStack[this.contentUndoStack.length - 1]
      if (
        last &&
        last.slideIndex === this.currentSlideIndex &&
        last.content === content
      ) {
        return
      }
      this.contentUndoStack.push({
        slideIndex: this.currentSlideIndex,
        content,
        selectionStart: ta ? ta.selectionStart : 0,
        selectionEnd: ta ? ta.selectionEnd : 0,
      })
      if (this.contentUndoStack.length > 50) {
        this.contentUndoStack.shift()
      }
      this.contentRedoStack = []
    },
    undoContentEdit() {
      const edit = this.slideEdits[this.currentSlideIndex]
      if (!edit) return false

      let idx = this.contentUndoStack.length - 1
      while (
        idx >= 0 &&
        this.contentUndoStack[idx].slideIndex !== this.currentSlideIndex
      ) {
        idx--
      }
      if (idx < 0) return false

      const ta = this.$refs.contentEditor
      this.contentRedoStack.push({
        slideIndex: this.currentSlideIndex,
        content: edit.content || '',
        selectionStart: ta ? ta.selectionStart : 0,
        selectionEnd: ta ? ta.selectionEnd : 0,
      })

      const prev = this.contentUndoStack.splice(idx, 1)[0]
      edit.content = prev.content
      this.$nextTick(() => {
        const editor = this.$refs.contentEditor
        if (editor) {
          const len = (editor.value || '').length
          editor.selectionStart = Math.min(prev.selectionStart, len)
          editor.selectionEnd = Math.min(prev.selectionEnd, len)
          editor.focus()
        }
        this.scheduleUpdate()
      })
      return true
    },
    redoContentEdit() {
      const edit = this.slideEdits[this.currentSlideIndex]
      if (!edit) return false

      let idx = this.contentRedoStack.length - 1
      while (
        idx >= 0 &&
        this.contentRedoStack[idx].slideIndex !== this.currentSlideIndex
      ) {
        idx--
      }
      if (idx < 0) return false

      const ta = this.$refs.contentEditor
      this.contentUndoStack.push({
        slideIndex: this.currentSlideIndex,
        content: edit.content || '',
        selectionStart: ta ? ta.selectionStart : 0,
        selectionEnd: ta ? ta.selectionEnd : 0,
      })

      const next = this.contentRedoStack.splice(idx, 1)[0]
      edit.content = next.content
      this.$nextTick(() => {
        const editor = this.$refs.contentEditor
        if (editor) {
          const len = (editor.value || '').length
          editor.selectionStart = Math.min(next.selectionStart, len)
          editor.selectionEnd = Math.min(next.selectionEnd, len)
          editor.focus()
        }
        this.scheduleUpdate()
      })
      return true
    },
    cleanInsertLicense(text) {
      if (!text) return ''
      // Bulletin PDFs often use * / ** as a newline / next-section marker
      return String(text)
        .split(/\*{1,2}/)[0]
        .replace(/\s+/g, ' ')
        .trim()
    },
    indentSelection() {
      const ta = this.$refs.contentEditor
      if (!ta) return
      this.snapshotContentForUndo()
      const edit = this.slideEdits[this.currentSlideIndex]
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const value = edit.content || ''

      const lineStart = value.lastIndexOf('\n', start - 1) + 1
      const lineEnd =
        end === start
          ? value.indexOf('\n', end)
          : value.indexOf('\n', end - 1)
      const blockEnd = lineEnd === -1 ? value.length : lineEnd
      const blockStart =
        end === start ? lineStart : value.lastIndexOf('\n', start - 1) + 1

      const before = value.slice(0, blockStart)
      const block = value.slice(blockStart, blockEnd)
      const after = value.slice(blockEnd)
      const indented = block
        .split('\n')
        .map((line) => '\t' + line)
        .join('\n')

      edit.content = before + indented + after
      this.$nextTick(() => {
        const added = indented.length - block.length
        ta.selectionStart = start + 1
        ta.selectionEnd = end + added
        ta.focus()
        this.scheduleUpdate()
      })
    },
    outdentSelection() {
      const ta = this.$refs.contentEditor
      if (!ta) return
      this.snapshotContentForUndo()
      const edit = this.slideEdits[this.currentSlideIndex]
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const value = edit.content || ''

      const blockStart = value.lastIndexOf('\n', start - 1) + 1
      const lineEnd =
        end === start
          ? value.indexOf('\n', end)
          : value.indexOf('\n', end - 1)
      const blockEnd = lineEnd === -1 ? value.length : lineEnd

      const before = value.slice(0, blockStart)
      const block = value.slice(blockStart, blockEnd)
      const after = value.slice(blockEnd)

      let removedBeforeCursor = 0
      const outdented = block
        .split('\n')
        .map((line, idx) => {
          let next = line
          if (next.startsWith('\t')) {
            next = next.slice(1)
            if (idx === 0) removedBeforeCursor = 1
          } else if (next.startsWith('    ')) {
            next = next.slice(4)
            if (idx === 0) removedBeforeCursor = 4
          } else if (next.startsWith(' ')) {
            const spaces = (next.match(/^ +/) || [''])[0].length
            const trim = Math.min(spaces, 4)
            next = next.slice(trim)
            if (idx === 0) removedBeforeCursor = trim
          }
          return next
        })
        .join('\n')

      edit.content = before + outdented + after
      this.$nextTick(() => {
        const removed = block.length - outdented.length
        ta.selectionStart = Math.max(blockStart, start - removedBeforeCursor)
        ta.selectionEnd = Math.max(
          ta.selectionStart,
          end - removed
        )
        ta.focus()
        this.scheduleUpdate()
      })
    },
    unboldSelection() {
      const ta = this.$refs.contentEditor
      if (!ta) return
      this.snapshotContentForUndo()
      const edit = this.slideEdits[this.currentSlideIndex]
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const value = edit.content || ''

      if (start === end) {
        // Insert unbold markers at cursor (works across lines once closed)
        edit.content = value.slice(0, start) + '****' + value.slice(end)
        this.$nextTick(() => {
          ta.selectionStart = start + 2
          ta.selectionEnd = start + 2
          ta.focus()
          this.scheduleUpdate()
        })
        return
      }

      const selected = value.slice(start, end)
      // Toggle off if already wrapped with **...**
      if (
        selected.startsWith('**') &&
        selected.endsWith('**') &&
        selected.length > 4
      ) {
        const unwrapped = selected.slice(2, -2)
        edit.content = value.slice(0, start) + unwrapped + value.slice(end)
        this.$nextTick(() => {
          ta.selectionStart = start
          ta.selectionEnd = start + unwrapped.length
          ta.focus()
          this.scheduleUpdate()
        })
        return
      }

      // Wrap selection — may span multiple lines
      const wrapped = `**${selected}**`
      edit.content = value.slice(0, start) + wrapped + value.slice(end)
      this.$nextTick(() => {
        ta.selectionStart = start
        ta.selectionEnd = start + wrapped.length
        ta.focus()
        this.scheduleUpdate()
      })
    },
    measureWordWidth(ctx, word) {
      const clean = word.replace(/\*\*/g, '')
      const isSuperscript = clean.startsWith('^')
      if (isSuperscript) {
        ctx.font = '52px Calibri Bold'
        return ctx.measureText(clean.substring(1) + ' ').width
      }
      // Bold is a safe upper bound for wrapping
      ctx.font = '72px Calibri Bold'
      return ctx.measureText(clean + ' ').width
    },
    drawStyledLine(ctx, line, x, y, styleState) {
      // ** toggles unbold; state persists across lines for multi-line spans
      const parts = line.split(/(\*\*|\^[0-9]+)/g).filter(Boolean)

      for (const part of parts) {
        if (part === '**') {
          styleState.unbold = !styleState.unbold
          continue
        }
        if (part.startsWith('^')) {
          const num = part.substring(1)
          ctx.font = '52px Calibri Bold'
          ctx.fillStyle = 'dimgray'
          ctx.fillText(num, x, y - 20)
          x += ctx.measureText(num).width
        } else {
          ctx.font = styleState.unbold
            ? '72px Calibri'
            : '72px Calibri Bold'
          ctx.fillStyle = 'black'
          ctx.fillText(part, x, y)
          x += ctx.measureText(part).width
        }
      }
      return x
    },
    selectBulletin(bulletin) {
      this.selectedBulletin = bulletin
      this.slideUrls = []
      this.slideEdits = []
      this.currentSlideIndex = 0
      this.contentUndoStack = []
      this.contentRedoStack = []
      this.showPdfPanel = false
      this.bulletinPageUrl = null
      this.pdfHalf = 0
    },
    updateWideScreen() {
      this.isWideScreen = window.matchMedia('(min-width: 1280px)').matches
    },
    dismissPdfPanel() {
      this.showPdfPanel = false
    },
    async renderBulletinPreview(page) {
      try {
        const viewport = page.getViewport({ scale: 2 })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext('2d')
        await page.render({ canvasContext: ctx, viewport }).promise
        this.bulletinPageUrl = canvas.toDataURL('image/jpeg', 0.88)
        this.pdfHalf = 0
      } catch (err) {
        console.error('Bulletin preview failed:', err)
        this.bulletinPageUrl = null
      }
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
    getSlideGroupRange(index) {
      if (
        index < 0 ||
        index >= this.slideEdits.length ||
        !this.slideEdits[index]
      ) {
        return { start: 0, end: 0 }
      }
      const title = this.slideEdits[index].title
      let start = index
      while (
        start > 0 &&
        this.slideEdits[start - 1].title === title
      ) {
        start--
      }
      let end = index + 1
      while (
        end < this.slideEdits.length &&
        this.slideEdits[end].title === title
      ) {
        end++
      }
      return { start, end }
    },
    moveSlideGroup(direction) {
      const { start, end } = this.getSlideGroupRange(this.currentSlideIndex)
      const groupLen = end - start
      if (groupLen <= 0) return

      const offsetInGroup = this.currentSlideIndex - start

      if (direction < 0) {
        if (start === 0) return
        const prev = this.getSlideGroupRange(start - 1)
        const urls = this.slideUrls.splice(start, groupLen)
        const edits = this.slideEdits.splice(start, groupLen)
        this.slideUrls.splice(prev.start, 0, ...urls)
        this.slideEdits.splice(prev.start, 0, ...edits)
        this.currentSlideIndex = prev.start + offsetInGroup
      } else {
        if (end >= this.slideUrls.length) return
        const next = this.getSlideGroupRange(end)
        const nextLen = next.end - next.start
        const urls = this.slideUrls.splice(start, groupLen)
        const edits = this.slideEdits.splice(start, groupLen)
        // After removal, the following group starts at `start`
        this.slideUrls.splice(start + nextLen, 0, ...urls)
        this.slideEdits.splice(start + nextLen, 0, ...edits)
        this.currentSlideIndex = start + nextLen + offsetInGroup
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

        // License line for hymns/inserts; permission + CCLI always at the end
        if (isHymn) {
          ctx.font = '22px Calibri'
          ctx.fillStyle = 'black'
          const postfix = 'Used by Permission. CCLI License #2848460'
          const licenseLine = license ? `${license}  ${postfix}` : postfix
          ctx.fillText(licenseLine, 270, 990)
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
      // Text starts at x=270. Full width 1530 → right edge ~1800.
      // Near the logo (y>850) narrow to 1050 so text stops before logo at x=1300.
      const FULL_WIDTH = 1530
      const NARROW_WIDTH = 1050
      const LOGO_Y = 850
      const SLIDE_BOTTOM = 900
      const LINE_HEIGHT = 76
      const BLANK_EXTRA = 76
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
      // Must match render start Y, and reset when a new slide would begin —
      // otherwise later verses inherit "near logo" narrow width while drawing
      // at the top of the next slide (e.g. "strange design?" wrapping early).
      let estimatedY = 203

      const advanceEstimatedY = (includeBlankExtra) => {
        if (includeBlankExtra && estimatedY > 203) {
          estimatedY += BLANK_EXTRA
        }
        estimatedY += LINE_HEIGHT
        if (estimatedY > SLIDE_BOTTOM) {
          estimatedY = 203
        }
      }

      for (let i = 0; i < contentLines.length; i++) {
        const contentLine = contentLines[i]
        lineNumber++ // Increment line counter

        // Check if line is blank
        if (contentLine.trim().length === 0) {
          lastLineWasBlank = true
          continue
        }

        // Mirror slide-break logic before wrapping this stanza so width
        // uses the Y the line will actually have on its slide
        if (lastLineWasBlank && estimatedY > 203) {
          let stanzaRaw = 0
          for (let j = i; j < contentLines.length; j++) {
            if (contentLines[j].trim().length === 0) {
              if (stanzaRaw > 0) break
              continue
            }
            stanzaRaw++
          }
          const testY =
            estimatedY + BLANK_EXTRA + stanzaRaw * LINE_HEIGHT
          const nextStanzaFits = testY <= SLIDE_BOTTOM
          if (
            estimatedY + BLANK_EXTRA > SLIDE_BOTTOM ||
            this.shouldBlankBreakToNewSlide(
              estimatedY,
              true,
              nextStanzaFits
            )
          ) {
            estimatedY = 203
          }
        }

        // Preserve leading tabs/spaces for indentation (tab = 4 units)
        currentIndent = this.getLeadingIndent(contentLine)
        const words = contentLine.trim().split(/\s+/)

        // Calculate line breaks
        ctx.font = '72px Calibri Bold'
        let lineWidth = currentIndent * ctx.measureText(' ').width
        let firstPiece = true
        for (const word of words) {
          const wordWidth = this.measureWordWidth(ctx, word)

          const effectiveMaxWidth =
            estimatedY > LOGO_Y ? NARROW_WIDTH : FULL_WIDTH

          if (
            currentLine.length > 0 &&
            lineWidth + wordWidth > effectiveMaxWidth
          ) {
            const pieceWasBlank = firstPiece && lastLineWasBlank
            lines.push({
              text: currentLine.join(' '),
              indent: currentIndent,
              lineNumber,
              wasBlank: pieceWasBlank,
            })
            advanceEstimatedY(pieceWasBlank)
            lastLineWasBlank = false
            firstPiece = false
            currentLine = [word]
            ctx.font = '72px Calibri Bold'
            lineWidth = currentIndent * ctx.measureText(' ').width + wordWidth
          } else {
            currentLine.push(word)
            lineWidth += wordWidth
          }
        }

        if (currentLine.length > 0) {
          const pieceWasBlank = firstPiece && lastLineWasBlank
          lines.push({
            text: currentLine.join(' '),
            indent: currentIndent,
            wasBlank: pieceWasBlank,
            lineNumber,
          })
          advanceEstimatedY(pieceWasBlank)
          lastLineWasBlank = false
          currentLine = []
        }
      }

      // Render lines with overflow handling
      const renderedSlides = []
      let currentCtx = ctx
      let currentCanvas = canvas
      let linesProcessed = 0
      let y = 203
      // Tracks ** unbold regions across wrapped lines and slide breaks
      const styleState = { unbold: false }

      console.log('Lines:', lines)

      while (linesProcessed < lines.length) {
        y = 203

        while (linesProcessed < lines.length) {
          const { text: line, indent, wasBlank } = lines[linesProcessed]
          const nextY = wasBlank && y > 203 ? y + 76 : y
          const wouldOverflow = nextY > 900
          // Blank → new slide only if the next stanza won't fit here
          // (two 4-liners pack; 5-liners / leftover verses split)
          const nextStanzaLines = this.countStanzaLines(
            lines,
            linesProcessed
          )
          const nextStanzaFits = this.stanzaFitsOnSlide(
            y,
            wasBlank,
            nextStanzaLines
          )
          const blankBreak = this.shouldBlankBreakToNewSlide(
            y,
            wasBlank,
            nextStanzaFits
          )
          const remainingWords = this.countRemainingWords(
            lines,
            linesProcessed
          )

          // Only start a new slide when enough content remains (avoids 1–2 word orphans)
          if (
            (blankBreak || wouldOverflow) &&
            y > 203 &&
            remainingWords >= this.minWordsForNewSlide
          ) {
            break
          }

          // Hard cap only when there is enough leftover to justify another slide
          if (
            wouldOverflow &&
            y > 1000 &&
            remainingWords >= this.minWordsForNewSlide
          ) {
            break
          }

          // Add extra spacing if previous line was blank
          if (wasBlank && y > 203) {
            y += 76 // Half the normal line height for blank line spacing
          }

          currentCtx.font = '72px Calibri Bold'
          const x = 270 + indent * currentCtx.measureText(' ').width
          this.drawStyledLine(currentCtx, line, x, y, styleState)

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
      if (!edit) return
      const isHymn = edit.type === 'hymn' || edit.type === 'insert'
      const editSnapshot = { ...edit }

      // Preserve textarea caret across re-render
      const ta = this.$refs.contentEditor
      const restoreSelection =
        ta && document.activeElement === ta
          ? { start: ta.selectionStart, end: ta.selectionEnd }
          : null

      // Get current slide group start index
      let startIndex = this.currentSlideIndex
      while (
        startIndex > 0 &&
        this.slideEdits[startIndex - 1].title === editSnapshot.title
      ) {
        startIndex--
      }

      // Remove all slides in current group
      let endIndex = startIndex
      while (
        endIndex < this.slideUrls.length &&
        this.slideEdits[endIndex].title === editSnapshot.title
      ) {
        endIndex++
      }

      this.renderSlide(
        editSnapshot.title.replace('+', ' '),
        editSnapshot.content,
        isHymn,
        editSnapshot.license
      ).then(({ slides, count }) => {
        // Keep any edits typed while rendering; re-render if they diverged
        const latest = this.slideEdits[this.currentSlideIndex]
        const merged = latest
          ? {
              ...editSnapshot,
              title: latest.title,
              content: latest.content,
              license: latest.license,
              type: latest.type,
            }
          : editSnapshot

        const contentChanged =
          merged.content !== editSnapshot.content ||
          merged.title !== editSnapshot.title ||
          merged.license !== editSnapshot.license ||
          merged.type !== editSnapshot.type

        // Replace all slides in group with new rendered slides
        this.slideUrls.splice(startIndex, endIndex - startIndex, ...slides)
        this.slideEdits.splice(startIndex, endIndex - startIndex)

        // Add edit data for each new slide
        for (let i = 0; i < count; i++) {
          this.slideEdits.splice(startIndex + i, 0, { ...merged })
        }

        // Adjust current slide index if needed
        if (this.currentSlideIndex >= startIndex + count) {
          this.currentSlideIndex = startIndex + count - 1
        } else if (this.currentSlideIndex < startIndex) {
          this.currentSlideIndex = startIndex
        }

        if (restoreSelection) {
          this.$nextTick(() => {
            const editor = this.$refs.contentEditor
            if (editor) {
              const len = (editor.value || '').length
              editor.selectionStart = Math.min(restoreSelection.start, len)
              editor.selectionEnd = Math.min(restoreSelection.end, len)
            }
          })
        }

        if (contentChanged) {
          this.scheduleUpdate()
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
      if (this.showPdfPanel) {
        this.dismissPdfPanel()
        return
      }
      // Side-by-side only when wide enough; otherwise open the Drive PDF
      if (this.bulletinPageUrl && this.isWideScreen) {
        this.showPdfPanel = true
        return
      }
      if (this.selectedBulletin) {
        window.open(this.selectedBulletin.url, '_blank')
      }
    },
    handleTypeChange() {
      const edit = this.slideEdits[this.currentSlideIndex]
      if (
        edit &&
        (edit.type === 'hymn' || edit.type === 'insert') &&
        !edit.license
      ) {
        edit.license = '©'
      }
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
      this.contentUndoStack = []
      this.contentRedoStack = []
      this.showPdfPanel = false
      this.bulletinPageUrl = null
      this.pdfHalf = 0
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
        await this.renderBulletinPreview(page)
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

        // Find inserts and their positions (PDF text items are often fragmented)
        const inserts = []
        const isInsertMarker = (text) => {
          const t = text.toLowerCase().trim()
          if (
            t === 'insert' ||
            t === 'insert:' ||
            t === '(insert)' ||
            t === '[insert]'
          ) {
            return true
          }
          // "Insert: Title" or "Insert Title" — not words like "inserting"
          return /^insert:\s*\S+/i.test(t) || /^insert\s+\S+/i.test(t)
        }

        for (let i = 0; i < items.length; i++) {
          const raw = items[i]
          if (!isInsertMarker(raw)) {
            continue
          }

          const prevRef = referencePositions.filter((rp) => rp.pos < i).pop()
          let title = raw
            .replace(/^\(?\[?insert\]?\)?:?\s*/i, '')
            .replace(/\s+/g, ' ')
            .trim()
          let cursor = i + 1

          // Title may be split across the next 1–3 text items
          while ((!title || title.length < 2) && cursor < items.length) {
            const next = items[cursor].replace(/\s+/g, ' ').trim()
            cursor++
            if (!next || isInsertMarker(next) || links.includes(next)) break
            title = next
          }

          // Pull a short following fragment into the title when the PDF split it
          while (
            title &&
            cursor < items.length &&
            items[cursor].trim().length > 0 &&
            items[cursor].trim().length < 4 &&
            !isInsertMarker(items[cursor]) &&
            !links.includes(items[cursor])
          ) {
            title = `${title} ${items[cursor].replace(/\s+/g, ' ').trim()}`
            cursor++
          }

          let license = ''
          if (cursor < items.length) {
            const maybeLicense = items[cursor].replace(/\s+/g, ' ').trim()
            // Prefer copyright-ish fragments; otherwise take the next item
            if (
              maybeLicense &&
              !links.includes(maybeLicense) &&
              !isInsertMarker(maybeLicense)
            ) {
              license = maybeLicense
              cursor++
              // Common PDF split: "© 2020" + "Writer Name"
              // Stop if asterisks appeared — those mark the next bulletin section
              if (
                cursor < items.length &&
                !/\*/.test(license) &&
                (/^©|^copyright|\d{4}/i.test(license) ||
                  license.length < 12) &&
                items[cursor].trim().length > 0 &&
                !/\*/.test(items[cursor]) &&
                !links.includes(items[cursor]) &&
                !isInsertMarker(items[cursor])
              ) {
                license = `${license} ${items[cursor]
                  .replace(/\s+/g, ' ')
                  .trim()}`
              }
            }
          }

          // Cut at * / ** — bulletin newlines / following liturgy often scrape in
          license = this.cleanInsertLicense(license)
          if (!license) {
            license = '©'
          } else if (!/^©|^copyright/i.test(license)) {
            license = `© ${license}`
          }

          if (title) {
            inserts.push({
              afterRef: prevRef ? prevRef.ref : null,
              title,
              license,
            })
          }
        }
        console.log('Found inserts with positions:', inserts)

        const pushInsertSlides = async (insert) => {
          console.log('Insert found:', insert)
          const { slides } = await this.renderSlide(
            insert.title,
            '',
            true,
            insert.license
          )
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

        // Generate slides for each link
        this.generatingSlides = true

        // Inserts with no prior hymn/scripture ref go first
        for (const insert of inserts.filter((ins) => ins.afterRef === null)) {
          await pushInsertSlides(insert)
        }

        const placedInsertKeys = new Set(
          inserts
            .filter((ins) => ins.afterRef === null)
            .map((ins) => `${ins.title}||${ins.license}`)
        )

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
              const { slides } = await this.renderSlide(
                title,
                content,
                !!isHymn
              )
              this.slideUrls.push(...slides)
              // Create edit data for each slide
              slides.forEach(() => {
                this.slideEdits.push({
                  type: isHymn ? 'hymn' : 'scripture',
                  title: title,
                  content: content || '',
                  license: isHymn ? '©' : '',
                })
              })

              // Check if there are any inserts that should come after this link
              const insertsAfterLink = inserts.filter(
                (insert) => insert.afterRef === link
              )
              for (const insert of insertsAfterLink) {
                await pushInsertSlides(insert)
                placedInsertKeys.add(`${insert.title}||${insert.license}`)
              }
            }
          }
          this.progress = Math.round(((index + 1) / links.length) * 100)
        }

        // Any inserts whose afterRef didn't match a generated link still get included
        for (const insert of inserts) {
          const key = `${insert.title}||${insert.license}`
          if (!placedInsertKeys.has(key)) {
            await pushInsertSlides(insert)
            placedInsertKeys.add(key)
          }
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

      // Keep leading indent for poetic books; strip stray leading spaces elsewhere
      const normalizedRef = String(reference)
        .replace(/\+/g, ' ')
        .replace(/%20/g, ' ')
        .trim()
      const isPoetry = /^(psalms?|prov(?:erbs?)?)\b/i.test(normalizedRef)
      if (!isPoetry) {
        final = final.replace(/^\s+/, '')
      }

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
        this.logoImage = await loadImage('/logo.png')
      } catch (err) {
        console.error('Error loading logo:', err)
      }
    },
  },
}
</script>
