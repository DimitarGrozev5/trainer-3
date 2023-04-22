type Program = {
  variables: Variable[];
  sessions: [Session, ...Session[]];
};

type Session = {
  id: string;
  variables: Variable[];
  sets: [SessionUnit, ...SessionUnit[]];
};

type TrainingSet = {
  type: "TrainingSet";
  reps: NumberValue | VariableValue;
  rest: number;
};

type RepeatUnit = {
  type: "RepeatUnit";
  whatToRepeat: [SessionUnit, ...SessionUnit[]];
  howManyTimes: Repeat;
};

type Repeat = NumberValue | VariableValue;

type NumberValue = {
  type: "value";
  value: number;
};

type VariableValue = {
  type: "variable";
  value: string;
};

type SessionUnit = TrainingSet | RepeatUnit;

type VariableType = "weight" | "reps" | "sets";
type Variable = {
  name: string;
  type: VariableType;
};

const QuickAndDead: Program = {
  variables: [
    { name: "Weight", type: "weight" },
    { name: "Reps per set", type: "reps" },
    { name: "Total sets", type: "sets" },
  ],
  sessions: [
    {
      id: "1",
      variables: [],
      sets: [
        {
          type: "RepeatUnit",
          whatToRepeat: [
            {
              type: "RepeatUnit",
              howManyTimes: { type: "variable", value: "Total sets" },
              whatToRepeat: [
                {
                  type: "TrainingSet",
                  reps: { type: "variable", value: "Reps per set" },
                  rest: 20,
                },
                {
                  type: "TrainingSet",
                  reps: { type: "variable", value: "Reps per set" },
                  rest: 20,
                },
              ],
            },
          ],
          howManyTimes: { type: "variable", value: "Total sets" },
        },
      ],
    },
  ],
};
