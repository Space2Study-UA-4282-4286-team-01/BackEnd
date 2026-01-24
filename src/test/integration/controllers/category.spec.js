const { serverInit, serverCleanup, stopServer } = require('~/test/setup')
const { expectError } = require('~/test/helpers')
const { UNAUTHORIZED } = require('~/consts/errors')
const testUserAuthentication = require('~/utils/testUserAuth')
const {
  roles: { TUTOR, STUDENT }
} = require('~/consts/auth')

const endpointUrl = '/categories/names'

const testResourceCategoryData = {
  name: 'Test Category',
  appearance: {
    color: '#FF5733',
    icon: 'TestIcon'
  }
}

const studentUserData = {
  role: 'student',
  firstName: 'Test',
  lastName: 'Student',
  email: 'teststudent@gmail.com',
  password: 'testpass123',
  appLanguage: 'en',
  isEmailConfirmed: true,
  lastLogin: new Date().toJSON(),
  lastLoginAs: 'student'
}

describe('Category controller - GET /categories/names', () => {
  let app, server, tutorAccessToken, studentAccessToken

  beforeAll(async () => {
    ; ({ app, server } = await serverInit())
  })

  beforeEach(async () => {
    tutorAccessToken = await testUserAuthentication(app, { role: TUTOR })
    studentAccessToken = await testUserAuthentication(app, studentUserData)

    // Create test categories
    await app
      .post('/resources-categories')
      .send(testResourceCategoryData)
      .set('Cookie', [`accessToken=${tutorAccessToken}`])

    await app
      .post('/resources-categories')
      .send({
        ...testResourceCategoryData,
        name: 'Another Category',
        appearance: { color: '#33FF57', icon: 'AnotherIcon' }
      })
      .set('Cookie', [`accessToken=${tutorAccessToken}`])
  })

  afterEach(async () => {
    await serverCleanup()
  })

  afterAll(async () => {
    await stopServer(server)
  })

  describe('Success business logic', () => {
    it('should return all categories names', async () => {
      const response = await app.get(endpointUrl).set('Cookie', [`accessToken=${tutorAccessToken}`])

      expect(response.statusCode).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBeGreaterThanOrEqual(2)

      // Check structure of returned items
      response.body.forEach((category) => {
        expect(category).toHaveProperty('_id')
        expect(category).toHaveProperty('name')
        expect(typeof category.name).toBe('string')
        // Should not have other fields like appearance, createdAt, etc.
        expect(category).not.toHaveProperty('appearance')
        expect(category).not.toHaveProperty('createdAt')
        expect(category).not.toHaveProperty('updatedAt')
      })

      // Verify specific categories are included
      const categoryNames = response.body.map((cat) => cat.name)
      expect(categoryNames).toContain(testResourceCategoryData.name)
      expect(categoryNames).toContain('Another Category')
    })

    it('should return categories names with correct structure', async () => {
      const response = await app.get(endpointUrl).set('Cookie', [`accessToken=${studentAccessToken}`])

      expect(response.statusCode).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)

      if (response.body.length > 0) {
        // Check structure of returned items
        response.body.forEach((category) => {
          expect(category).toHaveProperty('_id')
          expect(category).toHaveProperty('name')
          expect(typeof category.name).toBe('string')
          // Should not have other fields
          expect(category).not.toHaveProperty('appearance')
          expect(category).not.toHaveProperty('createdAt')
          expect(category).not.toHaveProperty('updatedAt')
        })
      }
    })

    it('should be accessible to all authorized roles', async () => {
      // Test with student role
      const studentResponse = await app.get(endpointUrl).set('Cookie', [`accessToken=${studentAccessToken}`])

      expect(studentResponse.statusCode).toBe(200)
      expect(Array.isArray(studentResponse.body)).toBe(true)

      // Test with tutor role
      const tutorResponse = await app.get(endpointUrl).set('Cookie', [`accessToken=${tutorAccessToken}`])

      expect(tutorResponse.statusCode).toBe(200)
      expect(Array.isArray(tutorResponse.body)).toBe(true)
    })
  })

  describe('Validation', () => {
    it('should throw UNAUTHORIZED when no token provided', async () => {
      const response = await app.get(endpointUrl)

      expectError(401, UNAUTHORIZED, response)
    })

    it('should throw UNAUTHORIZED when invalid token provided', async () => {
      const response = await app.get(endpointUrl).set('Cookie', ['accessToken=invalid-token'])

      expectError(401, UNAUTHORIZED, response)
    })
  })
})
