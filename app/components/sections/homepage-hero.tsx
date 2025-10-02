import { Button, ButtonHighlight } from '../button';
import { Hero, HeroSubtitle, HeroTitle } from '../hero';
import { HeroImage } from '../heroImage';
import { ChevronRight } from '../icons/chevronRight';

export const HomePageHero = () => {
  return (
    <Hero>
      <Button
        className="translate-y-[-1rem] animate-fade-in opacity-0"
        href="/"
        variant="secondary"
        size="small"
      >
        Introducing OptimAIzer
        <ButtonHighlight className="-mr-2 ml-2">→</ButtonHighlight>
      </Button>
      <div className="px-6 md:px-8">
        <HeroTitle className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
          OptimAIzer is a smarter way <br className="hidden md:block" /> to
          debug and review code
        </HeroTitle>
        <HeroSubtitle className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
          Leverage AI-powered Retrieval-Augmented Generation (RAG) to detect
          bugs, suggest optimizations, and explain complex code snippets.{' '}
          <br className="hidden md:block" />
          Built for collaboration, scalability, and security.
        </HeroSubtitle>
      </div>
      <Button
        href="/"
        variant="primary"
        size="large"
        className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:800ms]"
      >
        Get Started Free <ChevronRight className="ml-2" />
      </Button>
      <HeroImage />
    </Hero>
  );
};
