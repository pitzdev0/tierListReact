import { useEffect, useState } from 'react'
import './App.css'

const INITIAL_CONTENT = ['S', 'A', 'B', 'C', 'D', 'E']

function App() {
	const [content] = useState(INITIAL_CONTENT)
	const [draggedElement, setDraggedElement] = useState({
		element: null,
		srcContainer: null
	})

	const handleDragStart = (event) => {
		setDraggedElement({
			element: event.target,
			srcContainer: event.target.parentElement
		})
		event.dataTransfer.setData('text/plain', draggedElement.src)
	}

	const handleDragEnd = () => {
		setDraggedElement({
			element: null,
			srcContainer: null
		})
	}

	const createNewImg = (src) => {
		const imgElement = document.createElement('img')
		imgElement.src = src
		imgElement.className = 'item-img'
		imgElement.draggable = true

		// imgElement.addEventListener('dragstart', handleDragStart)
		// imgElement.addEventListener('dragend', handleDragEnd)

		imgElement.ondragstart = (e) => handleDragStart(e)
		imgElement.ondragend = (e) => handleDragEnd(e)

		const itemsSection = document.getElementById('selector-items')
		itemsSection.appendChild(imgElement)

		return imgElement
	}

	const handleImgInput = (e) => {
		const file = e.target.files[0]

		if (file) {
			const fileReader = new FileReader()
			fileReader.readAsDataURL(file) // como es una img => lee URL

			fileReader.onload = (evtRead) => {
				createNewImg(evtRead.target.result)
			}
		}
	}

	useEffect(() => {
		console.log(draggedElement)
	}, [draggedElement])

	useEffect(() => {
		const rows = document.querySelectorAll('.tier .row')
		rows.forEach((row) => {
			row.ondragover = handleDragOver // => previsualizar
			row.ondrop = handleDropItem // => finaliza
			row.ondragleave = handleDraLeave // => nos vamos

			// row.addEventListener('dragover', handleDragOver) // => previsualizar
			// row.addEventListener('drop', handleDropItem) // => finaliza
			// row.addEventListener('dragleave', handleDraLeave) // => nos vamos
		})
		// return () => {
		// 	rows.forEach((row) => {
		// 		row.removeEventListener('dragover', handleDragOver)
		// 		row.removeEventListener('drop', handleDropItem)
		// 		row.removeEventListener('dragleave', handleDraLeave)
		// 	})
	}, [])

	// el prevent default es necesario para los 3 eventos [Drop, Over, Leave]
	// ---------------------- DRAG AND DROP ----------------------
	const handleDropItem = (evt) => {
		evt.preventDefault()
		const { currentTarget, dataTransfer } = evt

		if (draggedElement.element && draggedElement.srcContainer) {
			draggedElement.element.srcContainer.removeChild(draggedElement.element)

			const src = dataTransfer.getData('text/plain')
			const newImgElement = createNewImg(src)
			currentTarget.appendChild(newImgElement)
		}
	}

	const handleDragOver = (evt) => {
		evt.preventDefault()
		console.log('drag over')
	}

	const handleDraLeave = (evt) => {
		evt.preventDefault()
		console.log('drag leave')
	}

	return (
		<>
			<header id='top-header'>
				<img
					src='https://tiermaker.com/images/tiermaker-logo.png'
					alt='Tiermaker Logo'
				/>
			</header>

			<div className='tier'>
				<div className='row'>
					<aside className='label' style={{ '--level': 'var(--color-s)' }}>
						<span
							contentEditable
							onChange={() => {}}
							dangerouslySetInnerHTML={{ __html: content[0] }}
						/>
					</aside>
				</div>

				<div className='row'>
					<aside className='label' style={{ '--level': 'var(--color-a)' }}>
						<span
							contentEditable
							onChange={() => {}}
							dangerouslySetInnerHTML={{ __html: content[1] }}
						/>
					</aside>
				</div>

				<div className='row'>
					<aside className='label' style={{ '--level': 'var(--color-b)' }}>
						<span
							contentEditable
							onChange={() => {}}
							dangerouslySetInnerHTML={{ __html: content[2] }}
						/>
					</aside>
				</div>

				<div className='row'>
					<aside className='label' style={{ '--level': 'var(--color-c)' }}>
						<span
							contentEditable
							onChange={() => {}}
							dangerouslySetInnerHTML={{ __html: content[3] }}
						/>
					</aside>
				</div>

				<div className='row'>
					<aside className='label' style={{ '--level': 'var(--color-d)' }}>
						<span
							contentEditable
							onChange={() => {}}
							dangerouslySetInnerHTML={{ __html: content[4] }}
						/>
					</aside>
				</div>

				<div className='row'>
					<aside className='label' style={{ '--level': 'var(--color-e)' }}>
						<span
							contentEditable
							onChange={() => {}}
							dangerouslySetInnerHTML={{ __html: content[5] }}
						/>
					</aside>
				</div>
			</div>

			<footer id='selector'>
				<section id='selector-buttons'>
					<label id='add-img-lbl' aria-label='Add image'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
							className='icon icon-tabler icons-tabler-outline icon-tabler-new-section'>
							<path stroke='none' d='M0 0h24v24H0z' fill='none' />
							<path d='M9 12l6 0' />
							<path d='M12 9l0 6' />
							<path d='M4 6v-1a1 1 0 0 1 1 -1h1m5 0h2m5 0h1a1 1 0 0 1 1 1v1m0 5v2m0 5v1a1 1 0 0 1 -1 1h-1m-5 0h-2m-5 0h-1a1 1 0 0 1 -1 -1v-1m0 -5v-2m0 -5' />
						</svg>
						<input
							type='file'
							id='img-input'
							name='file-selector'
							accept='image/*'
							hidden
							onChange={handleImgInput}
						/>
					</label>
					<button>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
							className='icon icon-tabler icons-tabler-outline icon-tabler-restore'>
							<path stroke='none' d='M0 0h24v24H0z' fill='none' />
							<path d='M3.06 13a9 9 0 1 0 .49 -4.087' />
							<path d='M3 4.001v5h5' />
							<path d='M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0' />
						</svg>
					</button>
				</section>

				<section id='selector-items'></section>
			</footer>
		</>
	)
}

export default App
