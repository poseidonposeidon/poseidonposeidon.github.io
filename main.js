
function fetchStock() {
    const stockSymbol = document.getElementById('stockSymbol').value.trim().toUpperCase();
    const previousSymbol = document.getElementById('outputSymbol').getAttribute('data-last-symbol'); // 获取上一次的股票代码

    // 判断股票代码是否改变
    if (stockSymbol !== previousSymbol) {
        // 仅当股票代码发生改变时，更新显示并清空容器
        document.getElementById('outputSymbol').innerText = '現在查詢的是：' + stockSymbol;
        document.getElementById('outputSymbol').setAttribute('data-last-symbol', stockSymbol); // 更新最后一次的股票代码

        // 清空所有相關的容器
        const containers = ['incomeStatementContainer', 'earningsCallTranscriptContainer', 'earningsCallCalendarContainer', 'historical_earning_calendar', 'stock_dividend_calendar'];
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = ''; // 清空容器內容
            }
        });
    }

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
        const expandButton = document.getElementById('expandButton_Income');
        if (expandButton) expandButton.style.display = 'none'; // 隐藏按钮
        const collapseButton = document.getElementById('collapseButton_Income');
        if (collapseButton) collapseButton.style.display = 'none';
        return;
    }

    let rows = {
        date: ['Date'],
        symbol: ['Symbol'],
        totalRevenue: ['Total Revenue'],
        costOfRevenue: ['Cost of Revenue'],
        grossProfit: ['Gross Profit'],
        researchAndDevelopmentExpenses: ['Research and Development Expenses'],
        sellingGeneralAndAdministrativeExpenses: ['Selling, General and Administrative Expenses'],
        interestExpense: ['Interest Expense'],
        operatingIncome: ['Operating Income'],
        incomeBeforeTax: ['Income Before Tax'],
        netIncome: ['Net Income'],
        netIncomeRatio: ['Net Income Ratio'],
        eps: ['EPS'],
        link: ['Report Link']
    };

    // 填充行数据
    data.forEach(entry => {
        rows.date.push(entry.date || 'N/A');
        rows.symbol.push(entry.symbol || 'N/A');
        rows.totalRevenue.push(formatNumber(entry.revenue));
        rows.costOfRevenue.push(formatNumber(entry.costOfRevenue));
        rows.grossProfit.push(formatNumber(entry.grossProfit));
        rows.researchAndDevelopmentExpenses.push(formatNumber(entry.researchAndDevelopmentExpenses));
        rows.sellingGeneralAndAdministrativeExpenses.push(formatNumber(entry.sellingGeneralAndAdministrativeExpenses));
        rows.interestExpense.push(formatNumber(entry.interestExpense));
        rows.operatingIncome.push(formatNumber(entry.operatingIncome));
        rows.incomeBeforeTax.push(formatNumber(entry.incomeBeforeTax));
        rows.netIncome.push(formatNumber(entry.netIncome));
        rows.netIncomeRatio.push(entry.netIncomeRatio ? (entry.netIncomeRatio * 100).toFixed(2) + '%' : 'N/A');
        rows.eps.push(entry.eps || 'N/A');
        rows.link.push(`<a href="${entry.link}" target="_blank">View Report</a>`);
    });

    // 构建 HTML 表格
    let htmlContent = '<table border="1" style="width: 100%; border-collapse: collapse;">';
    Object.keys(rows).forEach(key => {
        htmlContent += `<tr><th>${rows[key][0]}</th>`;
        rows[key].slice(1).forEach(value => {
            htmlContent += `<td>${value}</td>`;
        });
        htmlContent += '</tr>';
    });
    htmlContent += '</table>';

    container.innerHTML = htmlContent;
    const expandButton = document.getElementById('expandButton_Income');
    if (expandButton) expandButton.style.display = 'inline'; // 显示 Read More 按钮
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
    var stockSymbol = fetchStock();
    const year = document.getElementById('yearInput').value;
    const quarter = document.getElementById('quarterInput').value;
    const apiKey = 'GXqcokYeRt6rTqe8cpcUxGPiJhnTIzkf';

    if (stockSymbol.length === 0 || year.length === 0 || quarter.length === 0) {
        alert('請輸入股票代碼、年份及季度。');
        return;
    }

    const apiUrl = `https://financialmodelingprep.com/api/v3/earning_call_transcript/${stockSymbol}?year=${year}&quarter=${quarter}&apikey=${apiKey}`;
    fetchData_Transcript(apiUrl, displayEarningsCallTranscript, 'earningsCallTranscriptContainer');
}

function displayEarningsCallTranscript(transcript, container) {
    if (!transcript || !transcript.content) {
        container.innerHTML = '<p>資料不可用。</p>';
        return;
    }

    let htmlContent = `<p id="transcriptPreview">${transcript.content.slice(0, 1000)}...</p>`;
    htmlContent += `<p id="fullTranscript" style="display:none;">${transcript.content}</p>`;
    htmlContent += '<button id="expandButton" onclick="expandTranscript()">閱讀更多</button>';
    htmlContent += '<button id="collapseButton" style="display: none;" onclick="collapseTranscript()">顯示較少</button>';
    container.innerHTML = htmlContent;
}

function expandTranscript() {
    document.getElementById('transcriptPreview').style.display = 'none';
    document.getElementById('fullTranscript').style.display = 'block';
    document.getElementById('expandButton').style.display = 'none';
    document.getElementById('collapseButton').style.display = 'inline';
}

function collapseTranscript() {
    document.getElementById('transcriptPreview').style.display = 'block';
    document.getElementById('fullTranscript').style.display = 'none';
    document.getElementById('expandButton').style.display = 'inline';
    document.getElementById('collapseButton').style.display = 'none';
}

function fetchData_Transcript(apiUrl, callback, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<p>正在加載數據...</p>';
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                callback(data[0], container);
            } else {
                container.innerHTML = '<p>無相關數據。</p>';
            }
        })
        .catch(error => {
            console.error('數據加載錯誤: ', error);
            container.innerHTML = '<p>數據加載錯誤。請檢查控制台了解更多詳情。</p>';
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

    let rows = {
        date: ['Date'],
        symbol: ['Symbol'],
        eps: ['EPS'],
        estimatedEPS: ['Estimated EPS'],
        epsDifference: ['EPS預期差異'], // 新增列标题
        time: ['Time'],
        revenue: ['Revenue'],
        estimatedRevenue: ['Estimated Revenue'],
        revenueDifference: ['營收預期差異'], // 新增列标题
        fiscalDateEnding: ['Fiscal Date Ending']
    };

    data.forEach(item => {
        const itemDate = new Date(item.date);
        if (itemDate >= startDate && itemDate <= endDate) {
            rows.date.push(item.date || 'N/A');
            rows.symbol.push(item.symbol || 'N/A');
            rows.eps.push(item.eps != null ? item.eps : 'N/A');
            rows.estimatedEPS.push(item.epsEstimated != null ? item.epsEstimated : 'N/A');
            // 计算 EPS 预期差异百分比
            if (item.eps != null && item.epsEstimated != null && item.epsEstimated !== 0) {
                const epsDifference = ((item.eps - item.epsEstimated) / item.epsEstimated * 100).toFixed(2) + '%';
                rows.epsDifference.push(epsDifference);
            } else {
                rows.epsDifference.push('N/A');
            }
            rows.time.push(item.time || 'N/A');
            rows.revenue.push(item.revenue != null ? item.revenue.toLocaleString() : 'N/A');
            rows.estimatedRevenue.push(item.revenueEstimated != null ? item.revenueEstimated.toLocaleString() : 'N/A');
            // 计算营收预期差异百分比
            if (item.revenue != null && item.revenueEstimated != null && item.revenueEstimated !== 0) {
                const revenueDifference = ((item.revenue - item.revenueEstimated) / item.revenueEstimated * 100).toFixed(2) + '%';
                rows.revenueDifference.push(revenueDifference);
            } else {
                rows.revenueDifference.push('N/A');
            }
            rows.fiscalDateEnding.push(item.fiscalDateEnding || 'N/A');
        }
    });

    let htmlContent = '<table border="1">';
    Object.keys(rows).forEach(key => {
        htmlContent += `<tr><th>${rows[key][0]}</th>`;
        rows[key].slice(1).forEach(value => {
            htmlContent += `<td>${value}</td>`;
        });
        htmlContent += '</tr>';
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
