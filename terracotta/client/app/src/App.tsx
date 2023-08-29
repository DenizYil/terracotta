/* eslint-disable no-param-reassign */
import React, { FC, useState, useEffect } from 'react'
import { Box } from '@mui/material'
import AppContext, { ActiveRGBSelectorRange } from './AppContext'
import { Viewport, FeatureDataset } from './map/types'
import { ResponseMetadata200, KeyItem } from './common/data/getData'
import COLORMAPS, { Colormap } from './colormap/colormaps'
import AppScreen from './AppScreen'

const styles = {
	root: {
		width: '100%',
		height: '100vh',
		margin: 0,
		padding: 0,
	},
}

const details =
	'This applet lets you explore the data on any running Terracotta server. Just search for a dataset to get started!'

const defaultColormap = COLORMAPS[0]

const defaultViewport = {
	latitude: 30.62136584218745,
	longitude: 13.840430671501323,
	zoom: 1,
	bearing: 0,
	pitch: 0,
	transitionDuration: 2000,
}

const isEnvDev = process.env.REACT_APP_NODE_ENV === 'development'
const TC_URL = process.env.REACT_APP_TC_URL

export const defaultRGB: ActiveRGBSelectorRange = {
	R: {
		band: undefined,
		range: undefined,
	},
	G: {
		band: undefined,
		range: undefined,
	},
	B: {
		band: undefined,
		range: undefined,
	},
}

interface Props {
	hostnameProp: string | undefined
}

const App: FC<Props> = ({ hostnameProp }) => {
	const [viewport, setViewport] = useState<Viewport>(defaultViewport)
	const [isOpticalBasemap, setIsOpticalBasemap] = useState<boolean>(false)

	const [page, setPage] = useState<number>(0)
	const [limit, setLimit] = useState<number>(15)
	const [hostname, setHostname] = useState<string | undefined>(undefined)
	const [keys, setKeys] = useState<KeyItem[] | undefined>(undefined)
	const [datasets, setDatasets] = useState<ResponseMetadata200[] | undefined>(
		undefined,
	)
	const [activeDataset, setActiveDataset] = useState<number | undefined>(
		undefined,
	)
	const [hoveredDataset, setHoveredDataset] = useState<
		FeatureDataset | undefined
	>(undefined)
	const [selectedDatasetRasterUrl, setSelectedDatasetRasterUrl] = useState<
		string | undefined
	>(undefined)
	const [colormap, setColormap] = useState<Colormap>(defaultColormap)
	const [activeSinglebandRange, setActiveSinglebandRange] = useState<
		[number, number] | undefined
	>(undefined)
	const [activeEndpoint, setActiveEndpoint] = useState<string>('singleband')
	const [activeRGB, setActiveRGB] = useState<
		ActiveRGBSelectorRange | undefined
	>(defaultRGB)
	const [datasetBands, setDatasetBands] = useState<string[] | undefined>(
		undefined,
	)

	const initializeApp = (theHostname: string | undefined) => {
		// sanitize hostname

		// when developing, set up your .env in the /app folder with the env. variables:
		// - REACT_APP_NODE_ENV=development
		// - REACT_APP_TC_URL= your TC url to develop with

		if (isEnvDev && TC_URL) {
			theHostname = TC_URL
		}

		if (theHostname) {
			if (theHostname.charAt(theHostname.length - 1) === '/') {
				theHostname = theHostname.slice(0, theHostname.length - 1)
			}

			setHostname(theHostname)
		}
	}

	useEffect(() => {
		window.onload = initializeApp.bind(null, hostnameProp)
	}, [hostnameProp])

	return (
		<Box sx={styles.root}>
			<AppContext.Provider
				value={{
					state: {
						isOpticalBasemap,
						viewport,
						hostname,
						keys,
						hoveredDataset,
						datasets,
						activeDataset,
						selectedDatasetRasterUrl,
						page,
						limit,
						colormap,
						activeSinglebandRange,
						activeEndpoint,
						activeRGB,
						datasetBands,
					},
					actions: {
						setIsOpticalBasemap,
						setViewport,
						setKeys,
						setHoveredDataset,
						setDatasets,
						setActiveDataset,
						setSelectedDatasetRasterUrl,
						setPage,
						setLimit,
						setColormap,
						setActiveSinglebandRange,
						setActiveEndpoint,
						setActiveRGB,
						setDatasetBands,
					},
				}}
			>
				<AppScreen host={hostname} keys={keys} />
			</AppContext.Provider>
		</Box>
	)
}

export default App
