import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import './App.css'

const INITIAL_CONTENT = ['S', 'A', 'B', 'C', 'D', 'E']

function App() {
	const [content] = useState(INITIAL_CONTENT)
	const draggedElementRef = useRef({
		element: null,
		srcContainer: null
	})

	const handleResetBtn = () => {
		// recuperar todas las imágenes
		const imgs = document.querySelectorAll('.tier .item-img')
		const itemsSection = document.getElementById('selector-items')

		imgs.forEach((img) => {
			img.remove()
			itemsSection.appendChild(img)
		})
	}

	const handleDragStart = (event) => {
		draggedElementRef.current = {
			element: event.target,
			srcContainer: event.target.parentElement
		}

		// Al usar REF elimino la necesidad de setear manual mente el dataTransfer
		// event.dataTransfer.setData(
		// 	'text/plain',
		// 	draggedElementRef.current.srcContainer
		// )
	}

	const handleDragEnd = () => {
		draggedElementRef.current = {
			element: null,
			srcContainer: null
		}
	}

	const createNewImg = (src) => {
		const imgElement = document.createElement('img')
		imgElement.src = src
		imgElement.className = 'item-img'
		imgElement.draggable = true

		imgElement.ondragstart = (e) => handleDragStart(e)
		imgElement.ondragend = (e) => handleDragEnd(e)

		const itemsSection = document.getElementById('selector-items')
		itemsSection.appendChild(imgElement)

		return imgElement
	}

	const handleFilesInput = (files) => {
		if (!files || files.length === 0) return

		// transformamos el FileList en un Array
		const fileList = Array.from(files)
		fileList.forEach((file) => {
			const fileReader = new FileReader()
			fileReader.readAsDataURL(file) // lee img como URL

			fileReader.onload = (evtRead) => {
				createNewImg(evtRead.target.result)
			}
		})
	}

	const handleImgInput = (e) => {
		const { files } = e.target
		handleFilesInput(files)
	}

	useEffect(() => {
		const rows = document.querySelectorAll('.tier .row')
		rows.forEach((row) => {
			row.ondragover = handleDragOver // => previsualizar
			row.ondrop = handleDropItem // => finaliza
			row.ondragleave = handleDragLeave // => nos vamos
		})

		const itemsSection = document.getElementById('selector-items')
		itemsSection.addEventListener('dragover', handleDragOver)
		itemsSection.addEventListener('dragover', handleDragOverFromDesktop)

		itemsSection.addEventListener('drop', handleDropItem)
		itemsSection.addEventListener('drop', handleDropFromDesktop)

		itemsSection.addEventListener('dragleave', handleDragLeave)
		itemsSection.addEventListener('dragleave', handleDragLeaveFromDesktop)

		return () => {
			itemsSection.removeEventListener('dragover', handleDragOver)
			itemsSection.removeEventListener('dragover', handleDragOverFromDesktop)
			itemsSection.removeEventListener('drop', handleDropItem)
			itemsSection.removeEventListener('drop', handleDropFromDesktop)
		}
	}, [])

	const handleDropFromDesktop = (evt) => {
		evt.preventDefault()
		const { currentTarget, dataTransfer } = evt
		if (dataTransfer.getData('text/plain') === 'internal') return
		if (dataTransfer.types.includes('Files')) {
			handleFilesInput(dataTransfer.files)
			currentTarget.classList.remove('drag-files')
		}
	}

	const handleDragOverFromDesktop = (evt) => {
		evt.preventDefault()
		const { currentTarget, dataTransfer } = evt
		if (dataTransfer.types.includes('Files')) {
			currentTarget.classList.add('drag-files')
		}
	}

	const handleDragLeaveFromDesktop = (evt) => {
		evt.preventDefault()
		const { currentTarget } = evt
		currentTarget.classList.remove('drag-files')
	}

	// ---------------------- DRAG AND DROP ----------------------
	// el prevent default es necesario para los 3 eventos [Drop, Over, Leave]
	const handleDropItem = (evt) => {
		evt.preventDefault()
		const { currentTarget, dataTransfer } = evt

		const currentElement = draggedElementRef.current
		if (currentElement.element) {
			currentElement.srcContainer.removeChild(currentElement.element)

			const src = dataTransfer.getData('text/plain')
			const newImgElement = createNewImg(src)
			currentTarget.appendChild(newImgElement)
		}
		currentTarget.classList.remove('drag-over')
		currentTarget.querySelector('.drag-preview')?.remove()
	}

	const handleDragOver = (evt) => {
		evt.preventDefault()
		const { currentTarget } = evt

		// validaciones
		if (draggedElementRef.current.srcContainer === currentTarget) return

		currentTarget.classList.add('drag-over')

		const previewElement = currentTarget.querySelector('.drag-preview')
		if (draggedElementRef.current && !previewElement) {
			const preview = draggedElementRef.current.element?.cloneNode(true)
			if (preview) {
				preview.classList.add('drag-preview')
				currentTarget.appendChild(preview)
			}
		}
	}

	const handleDragLeave = (evt) => {
		evt.preventDefault()
		const { currentTarget } = evt
		currentTarget.classList.remove('drag-over')
		currentTarget.querySelector('.drag-preview')?.remove()
	}

	// ---- save btn
	const handleSaveBtn = () => {
		console.log('save')
		const tierElment = document.querySelector('.tier')
		html2canvas(tierElment).then((canvas) => {
			const URL = canvas.toDataURL('image/png')
			const link = document.createElement('a')
			link.href = URL
			link.download = 'tiermaker-img.png'

			document.body.appendChild(link)
			link.click()
			link.remove()
		})
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
							multiple
							type='file'
							id='img-input'
							name='file-selector'
							accept='image/*'
							hidden
							onChange={handleImgInput}
						/>
					</label>
					<button onClick={handleResetBtn}>
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
					<button onClick={handleSaveBtn}>
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
							className='icon icon-tabler icons-tabler-outline icon-tabler-download'>
							<path stroke='none' d='M0 0h24v24H0z' fill='none' />
							<path d='M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2' />
							<path d='M7 11l5 5l5 -5' />
							<path d='M12 4l0 12' />
						</svg>
					</button>
				</section>

				<section id='selector-items'></section>
			</footer>
		</>
	)
}

export default App
