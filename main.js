
function fetchStock(){
    const stockSymbol = document.getElementById('stockSymbol').value.trim().toUpperCase();
    return stockSymbol;
}

//////////////財務收入 Income Statement/////////////////
function fetchIncomeStatement() {
    stockSymbol = fetchStock();
    const period = document.getElementById('period').value;  // 獲取選擇的時段
    const apiKey = 'GXqcokYeRt6rTqe8cpcUxGPiJhnTIzkf';

    if (!stockSymbol) {
        alert('Please enter a stock symbol.');
        return;
    }

    const apiUrl = `https://financialmodelingprep.com/api/v3/income-statement/${stockSymbol}?period=${period}&apikey=${apiKey}`;
    fetchData_IncomeStatement(apiUrl, displayIncomeStatement, 'incomeStatementContainer');
}


function displayIncomeStatement(data, container) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<p>Data not available.</p>';
        document.getElementById('expandButton_Income').style.display = 'none'; // 隱藏按鈕
        document.getElementById('collapseButton_Income').style.display = 'none';
        return;
    }

    let previewContent = '<ul id="IncomeStatementPreview">';
    let fullContent = '<ul id="fullIncomeStatement" style="display: none;">'; // 初始時設置為隱藏

    data.forEach((entry, index) => {
        const itemHTML = `
            <li>Date: ${entry.date || 'N/A'}</li>
            <li>Symbol: ${entry.symbol || 'N/A'}</li>
            <li>Total Revenue: ${formatNumber(entry.revenue)}</li>
            <li>Cost of Revenue: ${formatNumber(entry.costOfRevenue)}</li>
            <li>Gross Profit: ${formatNumber(entry.grossProfit)}</li>
            <li>Research and Development Expenses: ${formatNumber(entry.researchAndDevelopmentExpenses)}</li>
            <li>Selling, General and Administrative Expenses: ${formatNumber(entry.sellingGeneralAndAdministrativeExpenses)}</li>
            <li>Interest Expense: ${formatNumber(entry.interestExpense)}</li>
            <li>Operating Income: ${formatNumber(entry.operatingIncome)}</li>
            <li>Income Before Tax: ${formatNumber(entry.incomeBeforeTax)}</li>
            <li>Net Income: ${formatNumber(entry.netIncome)}</li>
            <li>Net Income Ratio: ${entry.netIncomeRatio ? (entry.netIncomeRatio * 100).toFixed(2) + '%' : 'N/A'}</li>
            <li>EPS: ${entry.eps || 'N/A'}</li>
            <li>Link to Report: <a href="${entry.link}" target="_blank">View Report</a></li>
            </br>
        `;

        if (index === 0) {
            previewContent += itemHTML; // 只加第一筆資料至預覽部分
        }
        fullContent += itemHTML; // 加所有資料至完整部分
    });

    previewContent += '</ul>';
    fullContent += '</ul>';

    container.innerHTML = previewContent + fullContent;
    document.getElementById('expandButton_Income').style.display = 'inline'; // 顯示 Read More 按鈕
}


function expandIncomeStatement() {
    document.getElementById('IncomeStatementPreview').style.display = 'none';
    document.getElementById('fullIncomeStatement').style.display = 'block';
    document.getElementById('expandButton_Income').style.display = 'none';
    document.getElementById('collapseButton_Income').style.display = 'inline';
}

function collapseIncomeStatement() {
    document.getElementById('IncomeStatementPreview').style.display = 'block';
    document.getElementById('fullIncomeStatement').style.display = 'none';
    document.getElementById('expandButton_Income').style.display = 'inline';
    document.getElementById('collapseButton_Income').style.display = 'none';
}

function formatNumber(value) {
    // Check if the value is numeric and format it, otherwise return 'N/A'
    return value != null && !isNaN(value) ? parseFloat(value).toLocaleString('en-US') : 'N/A';
}
function fetchData_IncomeStatement(apiUrl, callback, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<p>Loading...</p>';
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // 檢查回應資料是否為 undefined 或非陣列
            if (data === undefined || !Array.isArray(data)) {
                container.innerHTML = '<p>Error loading data: Data is not an array or is undefined.</p>';
            } else {
                if (data.length > 0) {
                    callback(data, container);  // 修改這裡以傳遞整個數據陣列
                } else {
                    container.innerHTML = '<p>No data found for this symbol.</p>';
                }
            }
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
            container.innerHTML = '<p>Error loading data. Please check the console for more details.</p>';
        });
}

//////////////法說會逐字稿 Earnings Call Transcript/////////////////
function fetchEarningsCallTranscript() {
    stockSymbol = fetchStock();
    const year = document.getElementById('yearInput').value;
    const quarter = document.getElementById('quarterInput').value;
    const apiKey = 'GXqcokYeRt6rTqe8cpcUxGPiJhnTIzkf'; // Your API key
    if (stockSymbol.length === 0 || year.length === 0 || quarter.length === 0) {
        alert('Please enter stock symbol, year, and quarter.');
        return;
    }
    const apiUrl = `https://financialmodelingprep.com/api/v3/earning_call_transcript/${stockSymbol}?year=${year}&quarter=${quarter}&apikey=${apiKey}`;
    fetchData_Transcript(apiUrl, displayEarningsCallTranscript, 'earningsCallTranscriptContainer');
}

function displayEarningsCallTranscript(transcript, container) {
    let htmlContent = `<p id="transcriptPreview">${transcript.content.slice(0, 1000)}...</p>`;
    htmlContent += `<p id="fullTranscript" style="display:none;">${transcript.content}</p>`;
    container.innerHTML = htmlContent;
    document.getElementById('expandButton').style.display = 'inline';
}

function expandTranscript() {
    document.getElementById('transcriptPreview').style.display = 'none';
    document.getElementById('fullTranscript').style.display = 'block';
    document.getElementById('expandButton').style.display = 'none';
    document.getElementById('collapseButton').style.display = 'inline'; // 显示 "Read Less" 按钮
}

function collapseTranscript() {
    document.getElementById('transcriptPreview').style.display = 'block';
    document.getElementById('fullTranscript').style.display = 'none';
    document.getElementById('expandButton').style.display = 'inline'; // 再次显示 "Read More" 按钮
    document.getElementById('collapseButton').style.display = 'none'; // 隐藏 "Read Less" 按钮
}

function fetchData_Transcript(apiUrl, callback, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<p>Loading...</p>';
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // 檢查回應資料是否為 undefined 或非陣列
            if (data === undefined || !Array.isArray(data)) {
                container.innerHTML = '<p>Error loading data: Data is not an array or is undefined.</p>';
            } else {
                if (data.length > 0) {
                    callback(data[0], container);
                } else {
                    container.innerHTML = '<p>No data found for this symbol.</p>';
                }
            }
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
            container.innerHTML = '<p>Error loading data. Please check the console for more details.</p>';
        });
}


//////////////法說會日曆 Earnings Call Calendar/////////////////


function fetchEarningsCallCalendar() {
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;
    stockSymbol = fetchStock();
    const apiKey = 'GXqcokYeRt6rTqe8cpcUxGPiJhnTIzkf';
    if (!fromDate || !toDate) {
        alert('Please enter both from and to dates.');
        return;
    }
    const apiUrl = `https://financialmodelingprep.com/api/v3/earning_calendar?from=${fromDate}&to=${toDate}&apikey=${apiKey}`;
    fetchData_2(apiUrl, (data) => displayEarningsCallCalendar(data, 'earningsCallCalendarContainer', stockSymbol), 'earningsCallCalendarContainer');
}

function displayEarningsCallCalendar(data, containerId, stockSymbol) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container element not found');
        return;
    }

    if (!data || !Array.isArray(data)) {
        container.innerHTML = '<p>Error loading data: Data is not an array or is undefined.</p>';
        return;
    }

    const earningsData = stockSymbol ? data.filter(item => item.symbol.toUpperCase() === stockSymbol) : data;
    if (earningsData.length === 0) {
        container.innerHTML = `<p>No earnings calendar data found for ${stockSymbol}.</p>`;
        return;
    }

    let htmlContent = '<ul>';
    earningsData.forEach(item => {
        htmlContent += `<li>
            Date: ${item.date || 'N/A'} <br>
            Symbol: ${item.symbol || 'N/A'} <br>
            EPS: ${item.eps !== null ? item.eps.toFixed(4) : 'N/A'} <br>
            EPS Estimated: ${item.epsEstimated !== null ? item.epsEstimated.toFixed(4) : 'N/A'} <br>
            Revenue: ${item.revenue !== null ? item.revenue.toLocaleString() : 'N/A'} <br>
            Revenue Estimated: ${item.revenueEstimated !== null ? item.revenueEstimated.toLocaleString() : 'N/A'}
        </li>`;
    });
    htmlContent += '</ul>';
    container.innerHTML = htmlContent;
}

function fetchData_2(apiUrl, callback, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<p>Loading...</p>';
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data); // 查看原始返回數據
            // 確保 data 是一個陣列
            if (Array.isArray(data)) {
                if (data.length > 0) {
                    callback(data, container);
                } else {
                    container.innerHTML = '<p>No data found for this symbol.</p>';
                }
            } else if (data !== undefined) {
                // 如果 data 不是陣列,也不是 undefined,則視為錯誤
                throw new Error('Data is not an array');
            } else {
                // 如果 data 是 undefined,顯示錯誤訊息
                container.innerHTML = '<p>Error loading data: Data is not an array or is undefined.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
            container.innerHTML = `<p>Error loading data: ${error.message}. Please check the console for more details.</p>`;
        });
}
//////////////歷史獲利和未來獲利 Historical and Future Earnings/////////////////

function fetch_historical_earning_calendar() {
    stockSymbol = fetchStock();
    const apiKey = 'GXqcokYeRt6rTqe8cpcUxGPiJhnTIzkf'; // 你的 API 密鑰
    if (!stockSymbol) {
        alert('Please enter a stock symbol.');
        return;
    }

    const apiUrl = `https://financialmodelingprep.com/api/v3/historical/earning_calendar/${stockSymbol}?apikey=${apiKey}`;
    fetchData_historical_earning_calendar(apiUrl, display_historical_earning_calendar, 'historical_earning_calendar');
}

function display_historical_earning_calendar(data, container) {
    const fromDate = document.getElementById('fromDate_1').value;
    const toDate = document.getElementById('toDate_1').value;
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    if (!data || data.length === 0) {
        container.innerHTML = '<p>No data available.</p>';
        return;
    }

    let htmlContent = '<table border="1">';
    htmlContent += `
        <tr>
            <th>Date</th>
            <th>Symbol</th>
            <th>EPS</th>
            <th>Estimated EPS</th>
            <th>Time</th>
            <th>Revenue</th>
            <th>Estimated Revenue</th>
            <th>Fiscal Date Ending</th>
        </tr>
    `;

    data.forEach(item => {
        const itemDate = new Date(item.date);
        if (itemDate >= startDate && itemDate <= endDate) {
            htmlContent += `
                <tr>
                    <td>${item.date || 'N/A'}</td>
                    <td>${item.symbol || 'N/A'}</td>
                    <td>${item.eps != null ? item.eps : 'N/A'}</td>
                    <td>${item.epsEstimated != null ? item.epsEstimated : 'N/A'}</td>
                    <td>${item.time || 'N/A'}</td>
                    <td>${item.revenue != null ? item.revenue.toLocaleString() : 'N/A'}</td>
                    <td>${item.revenueEstimated != null ? item.revenueEstimated.toLocaleString() : 'N/A'}</td>
                    <td>${item.fiscalDateEnding || 'N/A'}</td>
                </tr>
            `;
        }
    });

    htmlContent += '</table>';
    container.innerHTML = htmlContent;
}

function fetchData_historical_earning_calendar(apiUrl, callback, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<p>Loading...</p>';
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                container.innerHTML = '<p>Error loading data: ' + data.error + '</p>';
                return;
            }
            callback(data, container);
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
            container.innerHTML = '<p>Error loading data. Please check the console for more details.</p>';
        });
}

//////////////股利發放日期/////////////////
function fetch_stock_dividend_calendar() {
    const fromDate = document.getElementById('fromDate_2').value;
    const toDate = document.getElementById('toDate_2').value;
    const apiKey = 'GXqcokYeRt6rTqe8cpcUxGPiJhnTIzkf'; // 请替换成您的 API 密钥

    if (!fromDate || !toDate) {
        alert('Please enter both a start and an end date.');
        return;
    }

    const apiUrl = `https://financialmodelingprep.com/api/v3/stock_dividend_calendar?from=${fromDate}&to=${toDate}&apikey=${apiKey}`;
    fetchData(apiUrl, display_stock_dividend_calendar, 'stock_dividend_calendar');
}

function display_stock_dividend_calendar(data, container) {
    stockSymbol = fetchStock();
    if (!data || data.length === 0) {
        container.innerHTML = '<p>No data available for the selected dates.</p>';
        return;
    }

    let htmlContent = '<table border="1">';
    htmlContent += `
        <tr>
            <th>Date</th>
            <th>Label</th>
            <th>Symbol</th>
            <th>Dividend</th>
            <th>Adjusted Dividend</th>
            <th>Declaration Date</th>
            <th>Record Date</th>
            <th>Payment Date</th>
        </tr>
    `;

    // 过滤并只显示匹配的股票代码
    data.forEach(item => {
        if (item.symbol.toUpperCase() === stockSymbol) { // 只添加符合输入的股票代码的行
            htmlContent += `
                <tr>
                    <td>${item.date || 'N/A'}</td>
                    <td>${item.label || 'N/A'}</td>
                    <td>${item.symbol || 'N/A'}</td>
                    <td>${item.dividend != null ? item.dividend : 'N/A'}</td>
                    <td>${item.adjDividend != null ? item.adjDividend : 'N/A'}</td>
                    <td>${item.declarationDate || 'N/A'}</td>
                    <td>${item.recordDate || 'N/A'}</td>
                    <td>${item.paymentDate || 'N/A'}</td>
                </tr>
            `;
        }
    });

    htmlContent += '</table>';
    container.innerHTML = htmlContent;

    if (htmlContent.indexOf('<tr>') === -1) { // 如果没有匹配的数据，显示消息
        container.innerHTML = '<p>No data available for the selected stock symbol.</p>';
    }
}



function fetchData(apiUrl, callback, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<p>Loading...</p>'; // 提供加载时的临时内容
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0) {
                container.innerHTML = '<p>No data available.</p>';
                return;
            }
            callback(data, container);
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
            container.innerHTML = '<p>Error loading data. Please check the console for more details.</p>';
        });
}
