// pages/blog/[slug].js
import styled from "styled-components";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Center from "@/components/Center";
import {mongooseConnect} from "@/lib/mongoose";
import {BlogPost} from "@/models/BlogPost";

const PageContainer = styled.div`
  background: #000;
  min-height: 100vh;
`;

const MainContent = styled.main`
  padding: 60px 0;
`;

const Article = styled.article`
  color: #fff;
  max-width: 800px;
  margin: 0 auto;
`;

const CoverImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #38b6ff;
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const Meta = styled.div`
  color: #38b6ff;
  margin-bottom: 30px;
  display: flex;
  gap: 20px;
  opacity: 0.8;
`;

const Content = styled.div`
  line-height: 1.8;
  font-size: 1.1rem;
  
  p {
    margin-bottom: 20px;
  }

  h2 {
    color: #38b6ff;
    margin: 40px 0 20px;
  }

  img {
    max-width: 100%;
    border-radius: 8px;
    margin: 20px 0;
  }
`;

export default function BlogPostPage({post}) {
  return (
    <PageContainer>
      <Header />
      <MainContent>
        <Center>
          <Article>
            <CoverImage src={post.coverImage} alt={post.title} />
            <Title>{post.title}</Title>
            <Meta>
              <span>{post.category}</span>
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </Meta>
            <Content dangerouslySetInnerHTML={{__html: post.content}} />
          </Article>
        </Center>
      </MainContent>
      <Footer />
    </PageContainer>
  );
}

export async function getServerSideProps({params}) {
  await mongooseConnect();
  const post = await BlogPost.findOne({slug: params.slug});
  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
    }
  };
}