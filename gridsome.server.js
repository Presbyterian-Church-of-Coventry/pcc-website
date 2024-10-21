// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api

// Changes here requires a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const nodeExternals = require('webpack-node-externals')
const _ = require('lodash')
const { google } = require('googleapis')

async function addBulletinNodes({ collection }) {
  const DRIVE_FOLDER_ID = '1VKvQM2kQgzwB3Btk-v5ges0uQzp1Fn7t'
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    project_id: process.env.GOOGLE_PROJECT_ID,
    scopes: ['https://www.googleapis.com/auth/drive'],
  })

  const drive = google.drive({ version: 'v3', auth })
  const res = await drive.files.list({
    q: `'${DRIVE_FOLDER_ID}' in parents and mimeType='application/pdf'`,
    fields: 'files(id, name)',
    spaces: 'drive',
    pageSize: 1000,
  })

  const existingNodes = new Map()

  try {
    for (const file of res.data.files) {
      let title = file.name.replace('.pdf', '')
      let dateMatch = /(\d{4}-\d{2}-\d{2})/.exec(title)
      let date = dateMatch ? dateMatch[1] : null
      let url = `https://drive.google.com/file/d/${file.id}/view`

      // Create a unique key using title and date
      const key = `${title}-${date}`

      if (!existingNodes.has(key)) {
        // If this is a new unique bulletin, add it to the collection
        collection.addNode({
          title,
          date,
          url,
        })
        existingNodes.set(key, true)
      } else {
        console.log(`Duplicate bulletin found: ${title} (${date}). Skipping.`)
      }
    }
  } catch (error) {
    console.error('Error processing bulletins:', error.message)
  }
}

module.exports = function (api) {
  // CREATE SCRIPTURE PAGES
  api.createPages(async ({ graphql, createPage }) => {
    const { data } = await graphql(`
      {
        allSermon {
          edges {
            node {
              title
              audio
              video
              scripture
              series {
                title
                path
                thumbnail(width: 400)
              }
              preacher {
                name
                path
              }
              path
              date(format: "MMMM DD, YYYY")
            }
          }
        }
      }
    `)

    let bibleBooks = await require('./src/assets/data/bible-books.json')
    bibleBooks = _.flatMapDeep(bibleBooks)

    for (const book of bibleBooks) {
      var bookSlug = book.toLowerCase().replace(/\ /g, '-')

      let bookSermons = data.allSermon.edges.filter(({ node }) => {
        return node.scripture.includes(book)
      })

      createPage({
        path: `/sermons/scripture/${bookSlug}`,
        component: './src/templates/ScripturePage.vue',
        context: {
          id: bookSlug,
          fields: {
            title: book,
            sermons: bookSermons,
            type: 'ScripturePage',
          },
        },
      })
    }
  })

  // CREATE BULLETINS
  api.loadSource(async (store) => {
    const bulletins = store.addCollection({
      typeName: 'Bulletin',
    })

    await addBulletinNodes({ collection: bulletins })
  })

  // ADD LASTNAME TO PREACHER
  api.loadSource(({ addSchemaResolvers }) => {
    addSchemaResolvers({
      Preacher: {
        lastName: {
          type: 'String',
          resolve: (src) => {
            let nameArray = src.name.split(' ')
            return `${nameArray[nameArray.length - 1]}`
          },
        },
      },
    })
  })

  api.chainWebpack((config, { isServer }) => {
    if (isServer) {
      config.externals([
        nodeExternals({
          allowlist: [
            /^buefy/,
            /^bulma/,
            /^typeface-montserrat/,
            /^tailwind/,
            /^vuetify/,
          ],
        }),
      ])
    }
  })
}
