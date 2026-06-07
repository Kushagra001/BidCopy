const APP_URL = 'https://bidcopy.com'

const PLATFORM_LABELS = {
  upwork:     'Upwork',
  freelancer: 'Freelancer.com',
  contra:     'Contra',
}

chrome.storage.local.get('bidcopy_job', ({ bidcopy_job: job }) => {
  const noJobEl  = document.getElementById('state-no-job')
  const jobEl    = document.getElementById('state-job-found')
  const titleEl  = document.getElementById('job-title-display')
  const badgeEl  = document.getElementById('platform-badge')
  const genBtn   = document.getElementById('generate-btn')

  if (!job || !job.title) {
    noJobEl.classList.remove('hidden')
    return
  }

  jobEl.classList.remove('hidden')
  titleEl.textContent = job.title.length > 60 ? job.title.slice(0, 60) + '…' : job.title
  badgeEl.textContent = PLATFORM_LABELS[job.platform] ?? job.platform

  const params = new URLSearchParams({
    platform:       job.platform ?? '',
    jobTitle:       job.title ?? '',
    jobDescription: job.description ?? '',
    jobBudget:      job.budget ?? '',
  })

  genBtn.href = `${APP_URL}/dashboard?${params.toString()}`
})
