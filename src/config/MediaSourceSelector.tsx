import { Autocomplete, TextField } from "@mui/material";
import React, { useState } from "react";
import { useHLSConfigurationContext } from "../context/HLSConfigurationContext";
import { HLSMediaSource, KNOWN_SOURCES } from "../sources";

export const MediaSourceSelector = () => {
	const { source, setSource } = useHLSConfigurationContext();

	const [savedSources, setSavedSources] = useState<HLSMediaSource[]>([]);

	const knownSources = Array.from(KNOWN_SOURCES.values());
	const options: HLSMediaSource[] = [...knownSources, ...savedSources];

	const onValueSelectedOrEntered = (
		event: React.SyntheticEvent<Element, Event>,
		newValue: string | HLSMediaSource
	) => {
		if (typeof newValue === "string") {
			const existingSource = options.find(({ source }) => source === newValue);

			if (existingSource) {
				setSource(existingSource);
			} else {
				const newSavedSource: HLSMediaSource = {
					source: newValue,
				};
				setSavedSources((prev) => [...prev, newSavedSource]);
				setSource(newSavedSource);
			}
		} else {
			setSource(newValue);
		}
	};

	return (
		<Autocomplete
			id="video-source-selector"
			value={source}
			options={options}
			blurOnSelect
			disableClearable
			freeSolo
			onChange={onValueSelectedOrEntered}
			getOptionLabel={(option) =>
				typeof option === "string" ? option : option.label || option.source
			}
			renderInput={(params) => (
				<TextField
					{...params}
					variant="outlined"
					label="Media Source"
					InputProps={{
						...params.InputProps,
						endAdornment: null,
					}}
					helperText="Select an existing demo source or paste a link to another HLS media"
				/>
			)}
		/>
	);
};
