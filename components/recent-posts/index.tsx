'use client';
import { FC } from 'react';
import { Screen } from '../screen';
import { Wrapper } from '../home-wrapper';
import { BubbleAnimationText } from '../bubble-text';
import { PostHeader } from '@/src/types/post';
import { PostList } from './post-list';
import Link from 'next/link';

export const RecentPosts: FC<{
  posts: PostHeader[];
}> = ({ posts }) => {
  return (
    <Screen className="px-8">
      <Wrapper>
        <BubbleAnimationText text="Posts" />
        <PostList posts={posts} className="mt-6">
          <div className="text-sm text-slate-500 mt-4 cursor-pointer">
            <Link href="/post">查看更多</Link>
          </div>
        </PostList>
      </Wrapper>
    </Screen>
  );
};
