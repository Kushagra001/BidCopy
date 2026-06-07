import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Nav } from '@/components/shared/Nav'
import { Footer } from '@/components/shared/Footer'
import { createAdminClient } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

export const revalidate = 3600

async function getPost(slug: string) {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  return data
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Not found' }
  return {
    title:       `${post.title} — BidCopy`,
    description: post.excerpt ?? undefined,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/blog" className="text-sm text-[--color-bc-muted] hover:text-[--color-bc-ink] mb-8 inline-block">
            ← Back to blog
          </Link>
          <article>
            <h1 className="text-4xl font-bold text-[--color-bc-ink] mb-4">{post.title}</h1>
            <p className="text-xs text-[--color-bc-faint] mb-10">{formatDate(post.published_at)}</p>
            {post.excerpt && (
              <p className="text-lg text-[--color-bc-muted] mb-8 leading-relaxed border-l-4 border-[--color-bc-blue] pl-4">
                {post.excerpt}
              </p>
            )}
            <div className="prose prose-slate max-w-none">
              {post.content}
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}
