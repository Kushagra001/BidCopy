/**
 * BidCopy Content Script
 * Detects job details on Upwork, Freelancer.com, and Contra.
 * Sends data to popup via chrome.storage.
 */

(function () {
  const host = window.location.hostname

  function extractUpwork() {
    const title = document.querySelector('h1, [data-test="job-title"]')?.textContent?.trim() ?? ''
    const description = document.querySelector('[data-test="description"], .job-description, .air3-line-clamp')?.textContent?.trim() ?? ''
    const budget = document.querySelector('[data-test="budget"], .js-budget')?.textContent?.trim() ?? ''
    return { title, description, budget, platform: 'upwork' }
  }

  function extractFreelancer() {
    const title = document.querySelector('.PageProjectViewLogout-header h1, .project-name')?.textContent?.trim() ?? ''
    const description = document.querySelector('.PageProjectViewLogout-description, .project-description')?.textContent?.trim() ?? ''
    const budget = document.querySelector('.PageProjectViewLogout-budget')?.textContent?.trim() ?? ''
    return { title, description, budget, platform: 'freelancer' }
  }

  function extractContra() {
    const title = document.querySelector('h1')?.textContent?.trim() ?? ''
    const description = document.querySelector('[class*="description"], [class*="opportunity"]')?.textContent?.trim() ?? ''
    const budget = document.querySelector('[class*="budget"], [class*="rate"]')?.textContent?.trim() ?? ''
    return { title, description, budget, platform: 'contra' }
  }

  let jobData = null

  if (host.includes('upwork.com'))     jobData = extractUpwork()
  if (host.includes('freelancer.com')) jobData = extractFreelancer()
  if (host.includes('contra.com'))     jobData = extractContra()

  if (jobData && jobData.title) {
    chrome.storage.local.set({ bidcopy_job: jobData }, () => {
      console.log('[BidCopy] Job detected:', jobData.title)
    })
  } else {
    chrome.storage.local.remove('bidcopy_job')
  }
})()
