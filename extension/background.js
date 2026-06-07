/**
 * BidCopy Background Service Worker
 * Handles tab updates and clears storage on navigation away from job pages.
 */

const JOB_URL_PATTERNS = [
  /upwork\.com\/jobs\//,
  /freelancer\.com\/projects\//,
  /contra\.com\/opportunity\//,
]

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const isJobPage = JOB_URL_PATTERNS.some((p) => p.test(tab.url))
    if (!isJobPage) {
      chrome.storage.local.remove('bidcopy_job')
    }
  }
})
