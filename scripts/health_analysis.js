const addPatientButton = document.getElementById("addPatient");
const report = document.getElementById("report");
const btnSearch = document.getElementById("btnSearch");
const patients = [];

function addPatient() {
    const name = document.getElementById("name").value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const age = document.getElementById("age").value;
    const condition = document.getElementById("condition").value;

    if ( name && gender && age && condition ) {
        patients.push({ name, gender: gender.value, age, condition });
        resetForm();
        generateReport();
    }
}

function resetForm() {
    document.getElementById("name").value = "";
    document.querySelector('input[name="gender"]:checked').checked = false;
    document.getElementById("age").value = "";
    document.getElementById("condition").value = "";
}
function generateReport() {
    const numPatients = patients.length;
    const conditionCount = {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0,
    };
    const genderConditionCount = {
        Male: {
            Diabetes: 0,
            Thyroid: 0,
            "High Blood Pressure": 0,
        },
        Female: {
            Diabetes: 0,
            Thyroid: 0,
            "High Blood Pressure": 0,
        },
    };
    
    for (const patient of patients) {
        conditionCount[patient.condition]++;
        genderConditionCount[patient.gender]++;
    }
    report.innerHTML = `Number of patients: ${numPatients}<br><br>`;
    report.innerHTML += `Conditions Breakdown:<br><br>`;
    for (const condition in conditionCount) {
        report.innerHTML += `${condition}: ${conditionCount[condition]}<br>`;
    }
    report.innerHTML += `<br>Gender-Base Condition:<br>`;
    for (const gender in genderConditionCount) {
        report.innerHTML += `${gender}<br>`;
        for (const condition in conditionCount) {
            report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionCount[gender][condition]}<br>`
        }
    }
}

function searchCondition() {
    const input = document.getElementById("conditionInput").value;
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    fetch("data/health_analysis.json")
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const condition = data.conditions.find(item => item.name.toLowerCase() === input.toLowerCase());
            
            if (condition) {
                const symptoms = condition.symptoms.join(', ');
                const prevention = condition.prevention.join(', ');
                const treatment = condition.treatment;

                resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
                resultDiv.innerHTML += `<img src="${condition.imagesrc}" alt="hjh">`;
                resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
                resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
                resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${treatment}</p>`;
            } else {
                resultDiv.innerHTML = 'Condition not found.';
                console.log(condition)
            }
        })
    .catch(error => {
        console.error('Error:', error);
        resultDiv.innerHTML = "An error ocurred while fetching data...";
    })
}

addPatientButton.addEventListener("click", addPatient);
btnSearch.addEventListener("click", searchCondition);