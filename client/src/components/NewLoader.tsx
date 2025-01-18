import { useEffect, useRef, useState } from "react";

const NewLoader = ({ className, global }: { className?: string, global?: boolean }) => {
    const [activeSvg, setActiveSvg] = useState(1);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const runEveryFourSeconds = () => {
            setActiveSvg(prev => prev === 5 ? 1 : prev + 1)
        };

        const setUpTimeout = () => {
            timerRef.current = setTimeout(() => {
                runEveryFourSeconds();
                setUpTimeout();
            }, 100);
        };

        setUpTimeout();

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return (
        <div className={className} style={global ? { top: "49%", left: "49%", position: "absolute" } : {}}>
            <img src={`/turtle/loader/loader_${activeSvg}.svg`} className="h-10 w-10" alt="turtle_loader" />
        </div>
    )
}

export default NewLoader
