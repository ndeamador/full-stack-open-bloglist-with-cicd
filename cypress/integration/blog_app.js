// Cypress uses some parts from the Mocha testing library, which recommends not to use => when declaring functions.
describe('Blog app', function () {
  beforeEach(function () {

    // clear the database before testing (http request to the testing-specific endpoint)
    cy.request('POST', 'http://localhost:3001/api/testing/reset')

    // since it is not yet possible to create users from the front end, we create one manually:
    const user = {
      name: 'Test bot',
      username: 'test',
      password: 'test'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)

    cy.visit('http://localhost:3001')
  })

  describe('Login', function () {

    it('Login form is shown', function () {
      cy.get('.login-form').should('be.visible')
    })


    it('succeeds with correct credentials', function () {
      cy.get('.login-button').click()
      // get an element by its css selector and type in it
      cy.get('.login-username-input').type('test')
      cy.get('.login-password-input').type('test')
      cy.get('.login-button').click()

      // cy.contains gets the first DOM element containing the text
      cy.contains('Test bot logged in').should('be.visible')
    })


    it('fails with wrong credentials (and the notification is red)', function () {
      cy.get('.login-button').click()

      // test invalid credentials (too short)
      cy.get('.login-username-input').type('x')
      cy.get('.login-password-input').type('x')
      cy.get('.login-button').click()
      // Some properties input after match might need a RegExp notation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
      cy.get('.notification').contains('Wrong username or password').should('be.visible').and('have.css', 'color', 'rgb(255, 0, 0)')

      // test inexisting credentials
      cy.get('.login-username-input').type('User not in database')
      cy.get('.login-password-input').type('password not in database')
      cy.get('.login-button').click()
      cy.get('.notification').contains('Wrong username or password').should('be.visible').and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })


  // describe.only makes the tester run only this block of tests
  // https://www.cypress.io/blog/2017/05/30/cypress-and-immutable-deploys/#run-end-to-end-tests-locally
  // To run a single test we can use it.only instead of it.

  // describe('When logged in', function () {
  describe('When logged in', function () {

    beforeEach(function () {
      // delete any users saved in local storage.
      cy.clearLocalStorage()

      // login bypassing the UI
      // https://docs.cypress.io/guides/getting-started/testing-your-app.html#Logging-in
      // done using a custom command stored in cypress/support/commands.js
      //https://docs.cypress.io/api/cypress-api/custom-commands.html
      cy.login({ username: 'test', password: 'test' })
    })


    it.skip('A blog can be created', function () {

      cy.get('.toggleable-initially-shown > button').click()
      cy.contains('create new').should('be.visible')
      cy.get('#blogform-title-input').type('New title')
      cy.get('#blogform-author-input').type('New author')
      cy.get('#blogform-url-input').type('New url')
      cy.get('.blogform-create-button').click()
      cy.get('.bloglist-container').contains('New title, by New author').should('be.visible')
    })


    describe('and there is a blog already present', function () {

      beforeEach(function () {

        cy.createBlog({
          title: 'Blog in database',
          author: 'test',
          url: 'url'
        })
      })


      it.skip('User can like a blog', function () {
        cy.get('.blog-container button:first').contains('view').click()
        cy.get('.extended-blog button:first').contains('like').click()
        cy.get('.likes-line:first').contains('1')
      })


      it.skip('User who created a blog can delete it', function () {

        cy.contains('Blog in database')
        cy.get('.blog-container button:first').contains('view').click()
        cy.get('.blog-delete-button:first').click()
        cy.get('body').should('not.contain', 'Blog in database')

      })


      it.skip('User who did not create a blog cannot delete it', function () {
        cy.clearLocalStorage()

        cy.createUser({ name: 'Someone else', username: 'OtherUser', password: 'test' })
        cy.login({ username: 'OtherUser', password: 'test' })
        cy.contains('Blog in database')
        cy.get('.blog-container button:first').contains('view').click()
        cy.get('.blog-container .blog-delete-button').should('not.exist')
      })

    })


    it.skip('Blogs are displayed in descending order according to the number of likes', function () {

      cy.clearLocalStorage()
      cy.login({ username: 'test', password: 'test' })



      cy.createBlog({
        title: 'Least liked blog',
        author: 'test',
        url: 'url',
        likes: 0
      })

      cy.createBlog({
        title: 'Initially most liked blog (10 likes)',
        author: 'test',
        url: 'url',
        likes: 10
      })

      cy.createBlog({
        title: '4 likes blog',
        author: 'test',
        url: 'url',
        likes: 4
      })

      cy.createBlog({
        title: 'Initially 9 likes then 11 likes blog',
        author: 'test',
        url: 'url',
        likes: 9
      })


      // Extract the likes data from each blog and check the order
      cy.get('.likes-line')
        .then(result => {
          let initialList = []

          for (let i = 0; i < 4; i++) {
            initialList[i] = parseInt(result[i].childNodes[1].data)
          }

          let sortedList = [...initialList]

          // because sort works alphabetically, we have to add a function to handle numerical sort.
          // also we reverse it to make the order descending
          sortedList.sort((a, b) => a - b).reverse()

          // check that the arrays have the same length and the same values
          const listIsOrdered = initialList.length === sortedList.length &&
            initialList.every((v, i) => v === sortedList[i])

          // The wrap returns true if the list is in descending order.
          cy.wrap(listIsOrdered)

        }).should('eq', true)


      // Now we check that the list rearranges itself as posts get likes. First we check the top two blogs:
      cy.get('.bloglist-container > :nth-child(1)').contains('Initially most liked blog (10 likes)')
      cy.get('.bloglist-container > :nth-child(2)').contains('Initially 9 likes then 11 likes blog')

      // We add two likes to the second blog:
      cy.get('.bloglist-container > :nth-child(2) button').contains('view').click()
      cy.get('.bloglist-container > :nth-child(2) .extended-blog button').contains('like').click().click()

      // Finally, we check that the order is swapped:
      cy.get('.bloglist-container > :nth-child(1)').contains('Initially 9 likes then 11 likes blog')
      cy.get('.bloglist-container > :nth-child(2)').contains('Initially most liked blog (10 likes)')

    })
  })
})