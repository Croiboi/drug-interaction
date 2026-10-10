const interactions = [
  {
    id: 1,
    name: "Warfarin",
    withDrug: "Aspirin",
    severity: "High",
    summary: "May increase bleeding risk significantly.",
    whyItMatters: "Both drugs impair clotting, which can raise the chance of bruising, nosebleeds, or internal bleeding.",
    recommendation: "Avoid combining them unless a clinician specifically approves it and monitors blood tests."
  },
  {
    id: 2,
    name: "Simvastatin",
    withDrug: "Grapefruit juice",
    severity: "Moderate",
    summary: "Can raise statin levels in the blood.",
    whyItMatters: "This can increase the risk of muscle aches, weakness, and rare muscle damage.",
    recommendation: "Limit or avoid grapefruit juice while taking this medication."
  },
  {
    id: 3,
    name: "Lisinopril",
    withDrug: "Ibuprofen",
    severity: "High",
    summary: "May reduce kidney protection and worsen blood pressure control.",
    whyItMatters: "NSAIDs can reduce the blood pressure-lowering effect of ACE inhibitors and strain the kidneys.",
    recommendation: "Use caution and ask a pharmacist before taking over-the-counter pain relievers."
  },
  {
    id: 4,
    name: "Metformin",
    withDrug: "Cimetidine",
    severity: "Moderate",
    summary: "May increase metformin exposure in the body.",
    whyItMatters: "Higher metformin levels can increase the chance of stomach upset and lactic acidosis in rare cases.",
    recommendation: "Discuss dose adjustments with a clinician if both are needed."
  },
  {
    id: 5,
    name: "Sertraline",
    withDrug: "Tramadol",
    severity: "High",
    summary: "May raise the risk of serotonin syndrome.",
    whyItMatters: "This combination can cause agitation, sweating, tremor, fever, or confusion.",
    recommendation: "Seek medical advice quickly if symptoms appear."
  },
  {
    id: 6,
    name: "Omeprazole",
    withDrug: "Clopidogrel",
    severity: "Moderate",
    summary: "May reduce the effectiveness of clopidogrel.",
    whyItMatters: "This can lessen protection against clot formation in certain patients.",
    recommendation: "Ask a clinician whether an alternate acid-suppressing medication is better."
  },
  {
    id: 7,
    name: "Amlodipine",
    withDrug: "Ketoconazole",
    severity: "Moderate",
    summary: "May increase amlodipine levels.",
    whyItMatters: "Higher exposure can make blood pressure medication effects stronger than intended.",
    recommendation: "Use with medical supervision and monitor for low blood pressure symptoms."
  },
  {
    id: 8,
    name: "Amoxicillin",
    withDrug: "Methotrexate",
    severity: "High",
    summary: "May increase methotrexate toxicity.",
    whyItMatters: "The combination can make side effects from methotrexate worse, especially with infection treatment.",
    recommendation: "Avoid unnecessary overlap and confirm with a pharmacist or prescriber."
  }
];

const searchInput = document.getElementById("searchInput");
const severityFilter = document.getElementById("severityFilter");
const resultsCount = document.getElementById("resultsCount");
const cardList = document.getElementById("cardList");
const detailPanel = document.getElementById("detailPanel");

let selectedId = interactions[0]?.id;

function getFilteredInteractions() {
  const query = searchInput.value.trim().toLowerCase();
  const severity = severityFilter.value;

  return interactions.filter((entry) => {
    const matchesQuery =
      !query ||
      entry.name.toLowerCase().includes(query) ||
      entry.withDrug.toLowerCase().includes(query) ||
      entry.summary.toLowerCase().includes(query);

    const matchesSeverity = severity === "all" || entry.severity === severity;
    return matchesQuery && matchesSeverity;
  });
}

function render() {
  const filtered = getFilteredInteractions();
  resultsCount.textContent = `${filtered.length} interaction${filtered.length === 1 ? "" : "s"} found`;

  if (!filtered.length) {
    cardList.innerHTML = '<div class="empty-state">No interactions match your current filters.</div>';
    detailPanel.innerHTML = '<div class="empty-state">Select a medication pair to see guidance.</div>';
    return;
  }

  const activeExists = filtered.some((entry) => entry.id === selectedId);
  if (!activeExists) {
    selectedId = filtered[0].id;
  }

  cardList.innerHTML = filtered
    .map((entry) => {
      const isActive = entry.id === selectedId;
      const badgeClass = entry.severity.toLowerCase();
      return `
        <article class="card ${isActive ? "active" : ""}" data-id="${entry.id}">
          <div class="card-header">
            <h3>${entry.name} + ${entry.withDrug}</h3>
            <span class="badge ${badgeClass}">${entry.severity}</span>
          </div>
          <p>${entry.summary}</p>
          <p><strong>Safety note:</strong> ${entry.recommendation}</p>
        </article>
      `;
    })
    .join("");

  renderDetail(selectedId);
}

function renderDetail(id) {
  const entry = interactions.find((item) => item.id === id);
  if (!entry) {
    detailPanel.innerHTML = '<div class="empty-state">Choose a medication pair to explore.</div>';
    return;
  }

  detailPanel.innerHTML = `
    <h2>${entry.name} + ${entry.withDrug}</h2>
    <p><strong>Severity:</strong> <span class="badge ${entry.severity.toLowerCase()}">${entry.severity}</span></p>
    <p>${entry.summary}</p>
    <h3>Why it matters</h3>
    <p>${entry.whyItMatters}</p>
    <h3>Recommendation</h3>
    <p>${entry.recommendation}</p>
  `;
}

searchInput.addEventListener("input", render);
severityFilter.addEventListener("change", render);

cardList.addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (!card) return;

  selectedId = Number(card.dataset.id);
  render();
});

render();
