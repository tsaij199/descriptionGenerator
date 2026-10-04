const queryInput = document.getElementById('queryInput');
const customizationInput = document.getElementById('customizationInput');
const descBtn = document.getElementById('descBtn');
const summaryBtn = document.getElementById('summaryBtn');
const topicsBtn = document.getElementById('topicsBtn');
const descResult = document.getElementById('descResult');
const summaryResult = document.getElementById('summaryResult');
const topicsResult = document.getElementById('topicsResult');
const summarySection = document.getElementById('summarySection');

const btnsDisabled = (disabled) => {
    descBtn.disabled = disabled;
    summaryBtn.disabled = disabled;
    topicsBtn.disabled = disabled;
};

const inputsDisabled = (disabled) => {
    queryInput.disabled = disabled;
    customizationInput.disabled = disabled;
};

const allDisabled = (disabled) => {
    btnsDisabled(disabled);
    inputsDisabled(disabled);
};

const updateDescTopicBtns = () => {
    const hasQuery = queryInput.value.trim().length > 0;

    descBtn.disabled = !hasQuery;
    topicsBtn.disabled = !hasQuery;
};

queryInput.addEventListener('input', updateDescTopicBtns);

// Handle Description Generation
document.getElementById('descBtn').addEventListener('click', async () => {
    const query = queryInput.value.trim();
    const customization = customizationInput.value.trim();

    descResult.textContent = 'Generating description...';
    summaryResult.textContent = '';
    topicsResult.innerHTML = '';
    summarySection.style.display = 'none';
    allDisabled(true);

    try {
        const response = await fetch('/generate-description', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, customization })
        });

        const data = await response.json();

        if (response.ok) {
            descResult.textContent = data.response;
            allDisabled(false);
        } 
        else {
            descResult.textContent = data.error;
        }
    } 
    catch {
        descResult.textContent = 'Error connecting to the server.';
    }
    finally {
        inputsDisabled(false);
        updateDescTopicBtns();
    }
});

// Handle Summary Generation
document.getElementById('summaryBtn').addEventListener('click', async () => {
    const description = descResult.textContent;

    summaryResult.textContent = 'Generating summary...';
    summarySection.style.display = 'block';
    allDisabled(true);

    try {
        const response = await fetch('/generate-summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description })
        });

        const data = await response.json();

        if (response.ok) {
            summaryResult.textContent = data.response;
        } 
        else {
            summaryResult.textContent = data.error;
        }
    } 
    catch {
        summaryResult.textContent = 'Error connecting to the server.';
    }
    finally {
        summaryBtn.disabled = false;
        inputsDisabled(false);
        updateDescTopicBtns();
    }
});

// Handle Related Topics Generation
document.getElementById('topicsBtn').addEventListener('click', async () => {
    const query = queryInput.value.trim();

    topicsResult.innerHTML = '<li>Loading related topics...</li>';
    allDisabled(true);

    try {
        const response = await fetch('/generate-related-topics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        const data = await response.json();

        if (response.ok) {
            topicsResult.innerHTML = '';
            const topics = [data.topic1, data.topic2, data.topic3, data.topic4, data.topic5];
            
            topics.forEach(topic => {
                if (topic) {
                    const li = document.createElement('li');
                    li.textContent = topic;
                    li.addEventListener('click', () => {
                        queryInput.value = topic;
                        descBtn.click();
                    });
                    topicsResult.appendChild(li);
                }
            });
        } 
        else {
            topicsResult.innerHTML = `<li>${data.error}</li>`;
        }
    } 
    catch {
        topicsResult.innerHTML = '<li>Error connecting to the server.</li>';
    }
    finally {
        inputsDisabled(false);
        updateDescTopicBtns();
    }
});