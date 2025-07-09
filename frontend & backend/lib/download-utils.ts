// Utility functions for handling downloads

// Function to download a file from a data URI
export function downloadFromDataUri(dataUri: string, filename: string) {
  const link = document.createElement("a")
  link.href = dataUri
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Function to trigger certificate download
export async function downloadCertificate(courseTitle: string, name: string) {
  try {
    // Call the API to generate the certificate
    const response = await fetch(
      `/api/generate-certificate?course=${encodeURIComponent(courseTitle)}&name=${encodeURIComponent(name)}`,
    )

    if (!response.ok) {
      // Log the full response for debugging
      const errorText = await response.text()
      console.error("API response not OK:", response.status, errorText)
      throw new Error(`Failed to generate certificate: ${response.statusText || errorText}`)
    }

    const data = await response.json()

    if (!data.success || !data.dataUri) {
      console.error("API response data invalid:", data)
      throw new Error("Failed to generate certificate: Invalid data received.")
    }

    // Download the certificate
    downloadFromDataUri(data.dataUri, data.filename)

    return { success: true, message: `Certificate for ${name} has been downloaded successfully.` }
  } catch (error) {
    console.error("Error downloading certificate:", error)
    return { success: false, message: `Failed to download certificate. Please try again. Error: ${error.message}` }
  }
}

// Function to trigger resource download - RESTORED ORIGINAL LOGIC
export async function downloadResource(courseTitle: string, resourceType: string, resourceName: string) {
  try {
    // Show loading message
    console.log(`Generating ${resourceName}...`)

    // Call the API to generate the resource
    const response = await fetch(
      `/api/download-resource?type=${encodeURIComponent(resourceType)}&course=${encodeURIComponent(courseTitle)}&resource=${encodeURIComponent(resourceName)}`,
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API response not OK:", response.status, errorText)
      throw new Error(`Failed to generate ${resourceName}: ${response.statusText || errorText}`)
    }

    const data = await response.json()

    if (!data.success || !data.dataUri) {
      console.error("API response data invalid:", data)
      throw new Error(`Failed to generate ${resourceName}: Invalid data received.`)
    }

    // Download the resource
    downloadFromDataUri(data.dataUri, data.filename)

    return { success: true, message: `${resourceName} has been downloaded successfully.` }
  } catch (error) {
    console.error(`Error downloading ${resourceName}:`, error)
    return { success: false, message: `Failed to download ${resourceName}. Please try again. Error: ${error.message}` }
  }
}
