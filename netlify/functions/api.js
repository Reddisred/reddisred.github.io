const handler = async (event) => {
  try {
    // Basic API handler for Netlify
    const path = event.path.replace('/.netlify/functions/api', '');

    if (path === '/allow') {
      return {
        statusCode: 200,
        body: JSON.stringify({ status: 'allowed' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
        }
      };
    }

    if (path === '/report-bug' && event.httpMethod === 'POST') {
      // Handle bug reports (would need webhook URL in environment)
      return {
        statusCode: 200,
        body: JSON.stringify({ status: 'ok' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Not Found' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};

export { handler };