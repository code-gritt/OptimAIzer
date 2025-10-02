import { Features } from '../features';
import {
  AutomationTrackingIcon,
  ConfigureIcon,
  DelayIcon,
  PrepareIcon,
  ScheduleIcon,
  ScopeIcon,
} from '../icons/features/momentum';

export const MomentumCycles = () => {
  return (
    <Features color="40,87,255" secondaryColor="48,58,117">
      <Features.Main
        title={
          <>
            Accelerate Development
            <br />
            With Review Cycles
          </>
        }
        text="OptimAIzer cycles help your team focus on the next set of code reviews and bug fixes. Maintain consistent workflow and track meaningful progress in every sprint."
        maxWidth="70rem"
        image="/image/cycles.webp"
        imageSize="large"
      />
      <Features.Grid
        features={[
          {
            icon: AutomationTrackingIcon,
            title: 'Automated Tracking.',
            text: 'All initiated analyses and reviews are added to the current cycle automatically.',
          },
          {
            icon: ScheduleIcon,
            title: 'Seamless Scheduling.',
            text: 'Pending code reviews or tasks roll over to the next cycle without manual intervention.',
          },
          {
            icon: ConfigureIcon,
            title: 'Fully Customizable.',
            text: 'Set cycle start/end dates, durations, and priorities to match your team’s workflow.',
          },
          {
            icon: DelayIcon,
            title: 'Predict Bottlenecks.',
            text: 'Receive AI-powered warnings for code review or bug-fix delays.',
          },
          {
            icon: ScopeIcon,
            title: 'Monitor Scope Changes.',
            text: 'See which tasks or analyses are added mid-cycle to prevent scope creep.',
          },
          {
            icon: PrepareIcon,
            title: 'Plan Ahead.',
            text: 'Schedule upcoming reviews and optimizations to stay ahead of deadlines.',
          },
        ]}
      />
    </Features>
  );
};
