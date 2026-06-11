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
  const featuredPost = posts[0]
  const gridPosts = posts.slice(1)

  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6 relative z-0 min-h-screen">
        {/* Subtle dot pattern background */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[--color-bc-surface] bg-[radial-gradient(var(--color-bc-border)_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
        
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <h1 className="text-5xl font-bold text-[--color-bc-ink] mb-4">BidCopy Blog</h1>
            <p className="text-lg text-[--color-bc-muted]">Tips and strategies for winning more freelance projects.</p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[--color-bc-muted]">Posts coming soon. Check back shortly.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {/* Featured Post */}
              {featuredPost && (
                <Link href={`/blog/${featuredPost.slug}`} className="block group">
                  <div className="bg-[--color-bc-white] border border-[--color-bc-border] rounded-2xl p-8 md:p-12 hover:border-[--color-bc-blue] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[--color-bc-blue] mb-3 block">Latest</span>
                    <h2 className="font-bold text-3xl md:text-4xl text-[--color-bc-ink] mb-4 group-hover:text-[--color-bc-blue] transition-colors">
                      {featuredPost.title}
                    </h2>
                    {featuredPost.excerpt && (
                      <p className="text-lg text-[--color-bc-muted] leading-relaxed mb-6 max-w-3xl">{featuredPost.excerpt}</p>
                    )}
                    <span className="text-sm font-medium text-[--color-bc-faint]">{formatDate(featuredPost.published_at)}</span>
                  </div>
                </Link>
              )}

              {/* Grid Posts */}
              {gridPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {gridPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="block group h-full">
                      <div className="bg-[--color-bc-white] border border-[--color-bc-border] rounded-2xl p-6 md:p-8 hover:border-[--color-bc-blue] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md flex flex-col h-full">
                        <h2 className="font-bold text-xl text-[--color-bc-ink] mb-3 group-hover:text-[--color-bc-blue] transition-colors">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-sm text-[--color-bc-muted] leading-relaxed mb-6 flex-grow">{post.excerpt}</p>
                        )}
                        <span className="text-xs font-medium text-[--color-bc-faint] mt-auto">{formatDate(post.published_at)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
