import { Button, ButtonHighlight } from '../button';
import { Features } from '../features';
import { ChevronRight } from '../icons/chevronRight';
import {
  DiscordIcon,
  FigmaIcon,
  FrontIcon,
  GitlabIcone,
  IntercomIcon,
} from '../icons/features/integrations';
import { AirbyteIcon } from '../icons/features/integrations/airbyte';
import { SentryIcon } from '../icons/features/integrations/sentry';
import { ZendeskIcon } from '../icons/features/integrations/zendesk';
import { GithubIcon } from '../icons/github';
import { SlackIcon } from '../icons/slack';

export const Workflows = () => {
  return (
    <div>
      <Features color="" secondaryColor="62,36,118">
        <Features.Main
          title={
            <>
              OptimAIzer Workflows <br />
              Smarter Code Reviews
            </>
          }
          text="From Git integrations to team communication tools, OptimAIzer streamlines code analysis, bug tracking, and collaboration in one unified workflow."
          maxWidth="65rem"
          buttonChildren={
            <>
              Explore Integrations
              <ButtonHighlight className="-mr-2 ml-2">
                <ChevronRight className="fill-white" />
              </ButtonHighlight>
            </>
          }
        />
        <Features.Grid
          features={[
            {
              title: 'GitHub and GitLab',
              text: 'Sync pull requests with automated code analyses and issue tracking.',
              icon: [GithubIcon, GitlabIcone],
            },
            {
              title: 'Slack and Discord',
              text: 'Receive notifications for code reviews, bug reports, and team updates.',
              icon: [SlackIcon, DiscordIcon],
            },
            {
              title: 'Sentry',
              text: 'Automatically create issues for code exceptions and errors detected by AI.',
              icon: SentryIcon,
            },
            {
              title: 'Airbyte',
              text: 'Sync code metrics and analysis data to external warehouses or databases.',
              icon: AirbyteIcon,
            },
            {
              title: 'Front, Intercom, and Zendesk',
              text: 'Keep communication tight with user feedback integrated into your workflow.',
              icon: [FrontIcon, IntercomIcon, ZendeskIcon],
            },
            {
              title: 'Figma',
              text: 'Attach design files to issues or code tasks for context-rich reviews.',
              icon: FigmaIcon,
            },
          ]}
        />
      </Features>
    </div>
  );
};
