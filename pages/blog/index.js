// pages/blog/index.js
import styled from "styled-components";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Center from "@/components/Center";
import {mongooseConnect} from "@/lib/mongoose";
import {BlogPost} from "@/models/BlogPost";
import Link from "next/link";

const PageContainer = styled.div`
  background: #000;
  min-height: 100vh;
`;

const MainContent = styled.main`
  padding: 60px 0;
`;

const Title = styled.h1`
  color: #38b6ff;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 50px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: #38b6ff;
    box-shadow: 0 0 10px #38b6ff;
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  
  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media screen and (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const BlogCard = styled.article`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(56, 182, 255, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(56, 182, 255, 0.2);
  }
`;

const BlogImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const BlogContent = styled.div`
  padding: 20px;
`;

const BlogTitle = styled.h2`
  color: #38b6ff;
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const BlogExcerpt = styled.p`
  color: #fff;
  opacity: 0.8;
  margin-bottom: 20px;
`;

const BlogMeta = styled.div`
  color: #38b6ff;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
`;

const CategoryFilter = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
`;

const CategoryButton = styled.button`
  background: ${props => props.active ? '#38b6ff' : 'transparent'};
  color: ${props => props.active ? '#000' : '#38b6ff'};
  border: 1px solid #38b6ff;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #38b6ff;
    color: #000;
  }
`;

export default function BlogPage({posts}) {
  return (
    <PageContainer>
      <Header />
      <MainContent>
        <Center>
          <Title>Blog Adapta</Title>
          <CategoryFilter>
            <CategoryButton active>Todos</CategoryButton>
            <CategoryButton>Guías de consumo</CategoryButton>
            <CategoryButton>Investigaciones</CategoryButton>
            <CategoryButton>Novedades</CategoryButton>
          </CategoryFilter>
          <BlogGrid>
            {posts.map(post => (
              <Link key={post._id} href={`/blog/${post.slug}`}>
                <BlogCard>
                  <BlogImage src={post.coverImage} alt={post.title} />
                  <BlogContent>
                    <BlogTitle>{post.title}</BlogTitle>
                    <BlogExcerpt>{post.excerpt}</BlogExcerpt>
                    <BlogMeta>
                      <span>{post.category}</span>
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </BlogMeta>
                  </BlogContent>
                </BlogCard>
              </Link>
            ))}
          </BlogGrid>
        </Center>
      </MainContent>
      <Footer />
    </PageContainer>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  const posts = await BlogPost.find({}, null, {sort: {publishedAt: -1}});
  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
    }
  };
}