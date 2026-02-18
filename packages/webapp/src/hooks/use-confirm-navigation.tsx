import { useEffect, useState } from "react";
import { useBlocker } from "react-router-dom";

export function useConfirmNavigation(when: boolean) {
    const [showModal, setShowModal] = useState(false);
    const blocker = useBlocker(when);

    const confirm = () => {
        blocker?.proceed?.();
    };

    const cancel = () => {
        if (blocker?.state !== "blocked") {
            return;
        };
        blocker.reset();
        setShowModal(false);
    };

    useEffect(() => {
        if (blocker?.state === "blocked" && !showModal) {
            setShowModal(true);
        }
    }, [blocker, showModal]);

    return { showModal, confirm, cancel };
}