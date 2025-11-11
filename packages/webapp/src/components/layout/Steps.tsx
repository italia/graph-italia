type StepsProps = {
  send: (event: any) => void;
  hasData: boolean;
  listLen: number;
  stepIndex: number;
};

export default function Steps({
  send,
  hasData,
  listLen,
  stepIndex,
}: StepsProps) {
  return (
    <div>
      <ul className="steps steps-vertical">
        <li
          className={`step ${
            stepIndex >= 0 ? "step-primary text-primary" : ""
          }`}
          onClick={() => send({ type: "IDLE" })}
        >
          {listLen > 0 ? "My Charts" : "Welcome"}
        </li>
        <li
          className={`step ${
            stepIndex >= 1 ? "step-primary text-primary" : ""
          }`}
          onClick={() => send({ type: "INPUT" })}
        >
          Upload data
        </li>
        <li
          className={`step ${
            stepIndex >= 2 ? "step-primary text-primary" : ""
          }`}
          onClick={() => (hasData ? send({ type: "CONFIG" }) : null)}
        >
          Configure
        </li>
        <li
          className={`step ${
            stepIndex >= 3 ? "step-primary text-primary" : ""
          }`}
          onClick={() => (hasData ? send({ type: "DONE" }) : null)}
        >
          Save
        </li>
      </ul>
    </div>
  );
}
