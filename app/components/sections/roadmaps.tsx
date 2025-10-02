import { Features } from '../features';
import {
  DocumentIcon,
  InsightIcon,
  MultiTeamIcon,
  NotificationIcon,
  RoadMapIcon,
  TimelineIcon,
} from '../icons/features/roadmap';

export const Roadmaps = () => {
  return (
    <div>
      <Features color="0,225,244" secondaryColor="31,49,64">
        <Features.Main
          text="Plan AI-powered review cycles, collaborate across teams, and make better decisions with actionable code insights and progress updates."
          title={
            <>
              Guide Development <br /> with Roadmaps
            </>
          }
          image="/image/roadmap.webp"
          imageSize="large"
          maxWidth="60rem"
        />
        <Features.Grid
          features={[
            {
              icon: MultiTeamIcon,
              title: 'Cross-team collaboration.',
              text: 'Coordinate code reviews and bug fixes across multiple teams.',
            },
            {
              icon: DocumentIcon,
              title: 'Documentation in context.',
              text: 'Attach specs, analysis notes, and code docs directly to tasks.',
            },
            {
              icon: RoadMapIcon,
              title: 'Custom development roadmaps.',
              text: 'Visualize progress across sprints, releases, and AI analysis cycles.',
            },
            {
              icon: TimelineIcon,
              title: 'Timeline view.',
              text: 'Track upcoming reviews, optimizations, and project milestones.',
            },
            {
              icon: InsightIcon,
              title: 'Analysis insights.',
              text: 'Monitor velocity, coverage, and code health over time.',
            },
            {
              icon: NotificationIcon,
              title: 'Personal alerts.',
              text: 'Stay updated on assigned reviews, analysis results, and team activity.',
            },
          ]}
        />
        <Features.Card
          features={[
            {
              title: 'Real-time updates',
              text: 'Keep your team informed on the health and progress of codebases and reviews.',
              image: '/image/card-updates.webp',
              imageClass: 'md:top-[40%] top-[50%] left-[7%] max-w-[100%]',
            },
            {
              title: 'Focus on priorities',
              text: 'Visualize all ongoing code reviews in one view to easily identify what needs attention.',
              image: '/image/card-roadmaps.webp',
              imageClass: 'md:top-[40%] top-[50%] left-[2%] max-w-[100%]',
            },
          ]}
        />
      </Features>
    </div>
  );
};
