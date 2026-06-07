import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/shared/Nav'
import { Footer } from '@/components/shared/Footer'
import { createAdminClient } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title:       'Blog — BidCopy',
  description: 'Tips, strategies, and guides for freelancers to write better proposals and win more projects.',
}

export const revalidate = 3600

async function getPosts() {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('posts')
      .select('id, slug, title, excerpt, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-[--color-bc-ink] mb-4">BidCopy Blog</h1>
            <p className="text-[--color-bc-muted]">Tips and strategies for winning more freelance projects.</p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[--color-bc-muted]">Posts coming soon. Check back shortly.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}
                  className="block bg-white border border-[--color-bc-border] rounded-xl p-6 hover:border-[--color-bc-blue] transition-colors group">
                  <h2 className="font-bold text-lg text-[--color-bc-ink] mb-2 group-hover:text-[--color-bc-blue] transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-[--color-bc-muted] leading-relaxed mb-3">{post.excerpt}</p>
                  )}
                  <span className="text-xs text-[--color-bc-faint]">{formatDate(post.published_at)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
