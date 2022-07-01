// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api

// Changes here requires a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const nodeExternals = require('webpack-node-externals')
const _ = require('lodash')
const AWS = require('aws-sdk')

async function addBulletinNodes({ collection }) {
  const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID
  const S3_SECRET = process.env.S3_SECRET

  const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint('s3.wasabisys.com'),
    region: 'us-east-1',
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET,
    params: {
      Bucket: 'coventrypca.church',
      Prefix: 'bulletins/',
    },
  })

  const res = await s3.listObjectsV2().promise()

  let title, date, url
  for (const { Key: file } of res.Contents) {
    if (/.pdf$/.test(file)) {
      title = file.replace('bulletins/', '').replace('.pdf', '')
      date = /(\d{4}-\d{2}-\d{2})/.exec(title)[1]
      url = 'https://s3.wasabisys.com/coventrypca.church/' + file

      collection.addNode({
        title,
        date,
        url,
      })
    }
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
