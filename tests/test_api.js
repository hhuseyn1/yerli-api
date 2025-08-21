// test_api.js - Complete API Test Suite
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';
let testArtistId = '';
let testProjectId = '';

// Test data
const testData = {
  admin: {
    email: 'admin@test.com',
    password: 'password123'
  },
  artist: {
    name: 'Test Artist',
    photoUrl: 'https://example.com/photo.jpg',
    smartLink: 'https://spotify.com/artist/test'
  },
  project: {
    name: 'Test Project',
    email: 'project@test.com',
    description: 'This is a test project description',
    status: 'pending'
  },
  email: {
    name: 'John Doe',
    email: 'john@test.com',
    description: 'Test email message'
  }
};

// Helper functions
const logTest = (testName, passed, response = null) => {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} - ${testName}`);
  if (response && !passed) {
    console.log(`   Response: ${response.status} - ${JSON.stringify(response.data)}`);
  }
  console.log('');
};

const makeRequest = async (method, endpoint, data = null, useAuth = false) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {}
    };

    if (useAuth && authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    if (data) {
      config.data = data;
      config.headers['Content-Type'] = 'application/json';
    }

    const response = await axios(config);
    return { success: true, response };
  } catch (error) {
    return { 
      success: false, 
      response: error.response || { status: 0, data: error.message } 
    };
  }
};

// Test functions
const testHealthCheck = async () => {
  console.log('🔍 Testing Health Check...');
  const { success, response } = await makeRequest('GET', '/health');
  logTest('GET /api/health', success && response.status === 200, response);
};

const testAdminEndpoints = async () => {
  console.log('🔐 Testing Admin Endpoints...');
  
  // Test admin register
  const registerResult = await makeRequest('POST', '/admin/register', testData.admin);
  const registerPassed = registerResult.success && registerResult.response.status === 201;
  logTest('POST /admin/register', registerPassed, registerResult.response);
  
  if (registerPassed) {
    authToken = registerResult.response.data.token;
  }

  // Test admin login
  const loginResult = await makeRequest('POST', '/admin/login', testData.admin);
  const loginPassed = loginResult.success && loginResult.response.status === 200;
  logTest('POST /admin/login', loginPassed, loginResult.response);

  if (loginPassed && !authToken) {
    authToken = loginResult.response.data.token;
  }

  // Test invalid credentials
  const invalidLoginResult = await makeRequest('POST', '/admin/login', {
    email: testData.admin.email,
    password: 'wrongpassword'
  });
  const invalidLoginPassed = !invalidLoginResult.success && invalidLoginResult.response.status === 401;
  logTest('POST /admin/login (invalid credentials)', invalidLoginPassed, invalidLoginResult.response);
};

const testArtistEndpoints = async () => {
  console.log('🎨 Testing Artist Endpoints...');

  // Test create artist (without auth - should fail)
  const createNoAuthResult = await makeRequest('POST', '/artists', testData.artist);
  const createNoAuthPassed = !createNoAuthResult.success && createNoAuthResult.response.status === 401;
  logTest('POST /artists (no auth)', createNoAuthPassed, createNoAuthResult.response);

  // Test create artist (with auth)
  const createResult = await makeRequest('POST', '/artists', testData.artist, true);
  const createPassed = createResult.success && createResult.response.status === 201;
  logTest('POST /artists (with auth)', createPassed, createResult.response);

  if (createPassed) {
    testArtistId = createResult.response.data.data._id;
  }

  // Test get all artists
  const getAllResult = await makeRequest('GET', '/artists?page=1&limit=10');
  const getAllPassed = getAllResult.success && getAllResult.response.status === 200;
  logTest('GET /artists', getAllPassed, getAllResult.response);

  // Test get single artist
  if (testArtistId) {
    const getOneResult = await makeRequest('GET', `/artists/${testArtistId}`);
    const getOnePassed = getOneResult.success && getOneResult.response.status === 200;
    logTest('GET /artists/:id', getOnePassed, getOneResult.response);

    // Test update artist
    const updateData = { ...testData.artist, name: 'Updated Artist Name' };
    const updateResult = await makeRequest('PUT', `/artists/${testArtistId}`, updateData, true);
    const updatePassed = updateResult.success && updateResult.response.status === 200;
    logTest('PUT /artists/:id', updatePassed, updateResult.response);
  }

  // Test search artists
  const searchResult = await makeRequest('GET', '/artists/search?q=test');
  const searchPassed = searchResult.success && searchResult.response.status === 200;
  logTest('GET /artists/search', searchPassed, searchResult.response);

  // Test search without query
  const searchNoQueryResult = await makeRequest('GET', '/artists/search');
  const searchNoQueryPassed = !searchNoQueryResult.success && searchNoQueryResult.response.status === 400;
  logTest('GET /artists/search (no query)', searchNoQueryPassed, searchNoQueryResult.response);

  // Test invalid artist ID
  const invalidIdResult = await makeRequest('GET', '/artists/invalid-id');
  const invalidIdPassed = !invalidIdResult.success && invalidIdResult.response.status === 400;
  logTest('GET /artists/:id (invalid ID)', invalidIdPassed, invalidIdResult.response);

  // Test non-existent artist
  const nonExistentResult = await makeRequest('GET', '/artists/507f1f77bcf86cd799439011');
  const nonExistentPassed = !nonExistentResult.success && nonExistentResult.response.status === 404;
  logTest('GET /artists/:id (not found)', nonExistentPassed, nonExistentResult.response);
};

const testProjectEndpoints = async () => {
  console.log('📋 Testing Project Endpoints...');

  // Test create project (without auth - should fail)
  const createNoAuthResult = await makeRequest('POST', '/projects', testData.project);
  const createNoAuthPassed = !createNoAuthResult.success && createNoAuthResult.response.status === 401;
  logTest('POST /projects (no auth)', createNoAuthPassed, createNoAuthResult.response);

  // Test create project (with auth)
  const projectData = { ...testData.project };
  if (testArtistId) {
    projectData.artistId = testArtistId;
    projectData.category = 'music';
  }

  const createResult = await makeRequest('POST', '/projects', projectData, true);
  const createPassed = createResult.success && createResult.response.status === 201;
  logTest('POST /projects (with auth)', createPassed, createResult.response);

  if (createPassed) {
    testProjectId = createResult.response.data.data._id;
  }

  // Test get all projects
  const getAllResult = await makeRequest('GET', '/projects?page=1&limit=10');
  const getAllPassed = getAllResult.success && getAllResult.response.status === 200;
  logTest('GET /projects', getAllPassed, getAllResult.response);

  // Test get projects with filters
  const getFilteredResult = await makeRequest('GET', '/projects?category=music&page=1&limit=5');
  const getFilteredPassed = getFilteredResult.success && getFilteredResult.response.status === 200;
  logTest('GET /projects (with filters)', getFilteredPassed, getFilteredResult.response);

  // Test get single project
  if (testProjectId) {
    const getOneResult = await makeRequest('GET', `/projects/${testProjectId}`);
    const getOnePassed = getOneResult.success && getOneResult.response.status === 200;
    logTest('GET /projects/:id', getOnePassed, getOneResult.response);

    // Test update project
    const updateData = { ...projectData, name: 'Updated Project Name', status: 'approved' };
    const updateResult = await makeRequest('PUT', `/projects/${testProjectId}`, updateData, true);
    const updatePassed = updateResult.success && updateResult.response.status === 200;
    logTest('PUT /projects/:id', updatePassed, updateResult.response);
  }

  // Test search projects
  const searchResult = await makeRequest('GET', '/projects/search?q=test');
  const searchPassed = searchResult.success && searchResult.response.status === 200;
  logTest('GET /projects/search', searchPassed, searchResult.response);

  // Test get projects by category
  const categoryResult = await makeRequest('GET', '/projects/category/music');
  const categoryPassed = categoryResult.success && categoryResult.response.status === 200;
  logTest('GET /projects/category/:category', categoryPassed, categoryResult.response);

  // Test search without query
  const searchNoQueryResult = await makeRequest('GET', '/projects/search');
  const searchNoQueryPassed = !searchNoQueryResult.success && searchNoQueryResult.response.status === 400;
  logTest('GET /projects/search (no query)', searchNoQueryPassed, searchNoQueryResult.response);

  // Test invalid project ID
  const invalidIdResult = await makeRequest('GET', '/projects/invalid-id');
  const invalidIdPassed = !invalidIdResult.success && invalidIdResult.response.status === 400;
  logTest('GET /projects/:id (invalid ID)', invalidIdPassed, invalidIdResult.response);
};

const testEmailEndpoint = async () => {
  console.log('📧 Testing Email Endpoint...');

  // Test send email
  const sendResult = await makeRequest('POST', '/email/send', testData.email);
  const sendPassed = sendResult.success && sendResult.response.status === 200;
  logTest('POST /email/send', sendPassed, sendResult.response);

  // Test send email with missing fields
  const missingFieldsResult = await makeRequest('POST', '/email/send', { name: 'Test' });
  const missingFieldsPassed = !missingFieldsResult.success && missingFieldsResult.response.status === 400;
  logTest('POST /email/send (missing fields)', missingFieldsPassed, missingFieldsResult.response);

  // Test send email with invalid email
  const invalidEmailResult = await makeRequest('POST', '/email/send', {
    ...testData.email,
    email: 'invalid-email'
  });
  const invalidEmailPassed = !invalidEmailResult.success && invalidEmailResult.response.status === 400;
  logTest('POST /email/send (invalid email)', invalidEmailPassed, invalidEmailResult.response);
};

const testDeleteOperations = async () => {
  console.log('🗑️ Testing Delete Operations...');

  // Test delete project
  if (testProjectId) {
    const deleteProjectResult = await makeRequest('DELETE', `/projects/${testProjectId}`, null, true);
    const deleteProjectPassed = deleteProjectResult.success && deleteProjectResult.response.status === 200;
    logTest('DELETE /projects/:id', deleteProjectPassed, deleteProjectResult.response);
  }

  // Test delete artist
  if (testArtistId) {
    const deleteArtistResult = await makeRequest('DELETE', `/artists/${testArtistId}`, null, true);
    const deleteArtistPassed = deleteArtistResult.success && deleteArtistResult.response.status === 200;
    logTest('DELETE /artists/:id', deleteArtistPassed, deleteArtistResult.response);
  }

  // Test delete non-existent resource
  const deleteNonExistentResult = await makeRequest('DELETE', '/artists/507f1f77bcf86cd799439011', null, true);
  const deleteNonExistentPassed = !deleteNonExistentResult.success && deleteNonExistentResult.response.status === 404;
  logTest('DELETE /artists/:id (not found)', deleteNonExistentPassed, deleteNonExistentResult.response);
};

const testValidationErrors = async () => {
  console.log('⚠️ Testing Validation Errors...');

  // Test artist with invalid URL
  const invalidArtistResult = await makeRequest('POST', '/artists', {
    name: 'Test Artist',
    photoUrl: 'invalid-url',
    smartLink: 'https://valid.com'
  }, true);
  const invalidArtistPassed = !invalidArtistResult.success && invalidArtistResult.response.status === 400;
  logTest('POST /artists (invalid photo URL)', invalidArtistPassed, invalidArtistResult.response);

  // Test project with invalid email
  const invalidProjectResult = await makeRequest('POST', '/projects', {
    name: 'Test Project',
    email: 'invalid-email',
    description: 'Test description'
  }, true);
  const invalidProjectPassed = !invalidProjectResult.success && invalidProjectResult.response.status === 400;
  logTest('POST /projects (invalid email)', invalidProjectPassed, invalidProjectResult.response);

  // Test missing required fields
  const missingFieldsResult = await makeRequest('POST', '/artists', {
    name: 'Test Artist'
    // missing photoUrl and smartLink
  }, true);
  const missingFieldsPassed = !missingFieldsResult.success && missingFieldsResult.response.status === 400;
  logTest('POST /artists (missing fields)', missingFieldsPassed, missingFieldsResult.response);
};

const testUnauthorizedAccess = async () => {
  console.log('🚫 Testing Unauthorized Access...');

  // Test protected endpoints without auth
  const protectedEndpoints = [
    { method: 'POST', endpoint: '/artists', data: testData.artist },
    { method: 'PUT', endpoint: '/artists/507f1f77bcf86cd799439011', data: testData.artist },
    { method: 'DELETE', endpoint: '/artists/507f1f77bcf86cd799439011' },
    { method: 'POST', endpoint: '/projects', data: testData.project },
    { method: 'PUT', endpoint: '/projects/507f1f77bcf86cd799439011', data: testData.project },
    { method: 'DELETE', endpoint: '/projects/507f1f77bcf86cd799439011' }
  ];

  for (const endpoint of protectedEndpoints) {
    const result = await makeRequest(endpoint.method, endpoint.endpoint, endpoint.data);
    const passed = !result.success && result.response.status === 401;
    logTest(`${endpoint.method} ${endpoint.endpoint} (no auth)`, passed, result.response);
  }

  // Test with invalid token
  const oldToken = authToken;
  authToken = 'invalid-token';
  
  const invalidTokenResult = await makeRequest('POST', '/artists', testData.artist, true);
  const invalidTokenPassed = !invalidTokenResult.success && invalidTokenResult.response.status === 401;
  logTest('POST /artists (invalid token)', invalidTokenPassed, invalidTokenResult.response);

  authToken = oldToken; // Restore valid token
};

const test404Endpoints = async () => {
  console.log('🔍 Testing 404 Endpoints...');

  // Test non-existent endpoints
  const nonExistentResult = await makeRequest('GET', '/nonexistent');
  const nonExistentPassed = !nonExistentResult.success && nonExistentResult.response.status === 404;
  logTest('GET /api/nonexistent', nonExistentPassed, nonExistentResult.response);
};

// Main test runner
const runAllTests = async () => {
  console.log('🚀 Starting Yerli API Tests...\n');
  console.log('='.repeat(50));
  
  try {
    await testHealthCheck();
    await testAdminEndpoints();
    await testArtistEndpoints();
    await testProjectEndpoints();
    await testEmailEndpoint();
    await testValidationErrors();
    await testUnauthorizedAccess();
    await testDeleteOperations();
    await test404Endpoints();
    
    console.log('='.repeat(50));
    console.log('✨ All tests completed!');
    console.log('\n📝 Summary:');
    console.log('- Make sure MongoDB is running');
    console.log('- Make sure the server is running on http://localhost:3000');
    console.log('- Check the console output for any failed tests');
    console.log('- Green ✅ means test passed');
    console.log('- Red ❌ means test failed');
    
  } catch (error) {
    console.error('💥 Test runner error:', error.message);
  }
};


console.log('To install axios for testing, run: npm install axios --save-dev');
console.log('Then run: npm test\n');

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testHealthCheck,
  testAdminEndpoints,
  testArtistEndpoints,
  testProjectEndpoints,
  testEmailEndpoint,
  testValidationErrors,
  testUnauthorizedAccess,
  testDeleteOperations,
  test404Endpoints
};

// Alternative: Postman Collection JSON (copy and import to Postman)
const postmanCollection = {
  "info": {
    "name": "Yerli Backend API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{authToken}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api",
      "type": "string"
    },
    {
      "key": "authToken",
      "value": "",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Admin",
      "item": [
        {
          "name": "Register Admin",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@test.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/admin/register",
              "host": ["{{baseUrl}}"],
              "path": ["admin", "register"]
            }
          }
        },
        {
          "name": "Login Admin",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@test.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/admin/login",
              "host": ["{{baseUrl}}"],
              "path": ["admin", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Artists",
      "item": [
        {
          "name": "Create Artist",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{authToken}}",
                  "type": "string"
                }
              ]
            },
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Test Artist\",\n  \"photoUrl\": \"https://example.com/photo.jpg\",\n  \"smartLink\": \"https://spotify.com/artist/test\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/artists",
              "host": ["{{baseUrl}}"],
              "path": ["artists"]
            }
          }
        },
        {
          "name": "Get All Artists",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/artists?page=1&limit=10",
              "host": ["{{baseUrl}}"],
              "path": ["artists"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "10"
                }
              ]
            }
          }
        },
        {
          "name": "Search Artists",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/artists/search?q=test",
              "host": ["{{baseUrl}}"],
              "path": ["artists", "search"],
              "query": [
                {
                  "key": "q",
                  "value": "test"
                }
              ]
            }
          }
        }
      ]
    }
  ]
};
