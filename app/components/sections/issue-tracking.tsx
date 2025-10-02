import { CSSProperties } from 'react';
import { Features } from '../features';
import {
  AutomatedBacklogIcon,
  CustomViewsIcon,
  DiscussionIcon,
  IssuesIcon,
  ParentSubIcon,
  WorkflowsIcon,
} from '../icons/features/issue-tracking';

export const IssueTracking = () => {
  return (
    <Features color="194,97,254" secondaryColor="53,42,79">
      <Features.Main
        text="Create code review tasks in seconds, discuss bugs in context, and streamline workflows with views tailored to your team."
        maxWidth="60rem"
        image="/image/issues.webp"
        imageSize="small"
        title={
          <>
            Code & Bug Management <br />
            {''}
            made easy
          </>
        }
      />
      <Features.Grid
        features={[
          {
            icon: ParentSubIcon,
            title: 'Hierarchical issues.',
            text: 'Break large code problems into smaller actionable tasks.',
          },
          {
            icon: AutomatedBacklogIcon,
            title: 'Automated tracking.',
            text: 'OptimAIzer auto-updates issue status based on analysis results.',
          },
          {
            icon: WorkflowsIcon,
            title: 'Custom workflows.',
            text: 'Define unique states for bug resolution and code reviews.',
          },
          {
            icon: CustomViewsIcon,
            title: 'Filters and views.',
            text: 'Focus on the code and issues that matter most to you.',
          },
          {
            icon: DiscussionIcon,
            title: 'Contextual discussions.',
            text: 'Collaborate directly on code snippets without losing context.',
          },
          {
            icon: IssuesIcon,
            title: 'Templates for reports.',
            text: 'Guide your team to submit clear, actionable bug reports.',
          },
        ]}
      />
      <Features.Card
        features={[
          {
            image: '/image/card-board.webp',
            imageClass: 'top-[50%] md:top-[40%] w-[200%]',
            title: 'List and board views',
            text: 'Switch between list and board layouts to track code issues and tasks efficiently.',
          },
          {
            image: '/image/card-views.webp',
            imageClass:
              'top-[40%] left-[12px] md:top-[34%] md:left-[24px] w-[110%]',
            title: 'Customizable workflows',
            text: 'Apply filters and operators to organize code reviews and bug tracking the way your team prefers.',
          },
        ]}
      />
    </Features>
  );
};
