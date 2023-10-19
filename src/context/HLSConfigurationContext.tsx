import React, {
	PropsWithChildren,
	createContext,
	useContext,
	useState,
} from "react";
import { HLSMediaSource, KNOWN_SOURCES } from "../sources";

interface HLSConfigurationContext {
	source: HLSMediaSource;
	setSource: (src: HLSMediaSource) => void;
}

const HLSConfigurationContext = createContext<HLSConfigurationContext | null>(
	null
);

const initialSource = KNOWN_SOURCES.get("COOKPAD_DEMO")!;

export const HLSConfigurationContextProvider: React.FC<PropsWithChildren> = ({
	children,
}) => {
	const [mediaSource, setMediaSource] = useState<HLSMediaSource>(initialSource);

	const contextValue: HLSConfigurationContext = {
		source: mediaSource,
		setSource: setMediaSource,
	};

	return (
		<HLSConfigurationContext.Provider value={contextValue}>
			{children}
		</HLSConfigurationContext.Provider>
	);
};

export const useHLSConfigurationContext = (): HLSConfigurationContext => {
	const contextValue = useContext(HLSConfigurationContext);

	if (!contextValue) {
		throw new Error(
			"HLS Configuration context is null. Please ensure the context is accessed within a provider."
		);
	}

	return contextValue;
};
