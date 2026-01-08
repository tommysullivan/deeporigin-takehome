import { useState } from "react";
import { urlsBasePath } from "@/data/urlsBasePath";
import { updateURLSlug } from "@/data/updateURLSlug";

interface URLEntryProps {
  id: number;
  originalURL: string;
  shortURLSlug: string;
  clickCount: number;
  onUpdate: (id: number, newSlug: string) => void;
}

export function URLEntry({
  id,
  originalURL,
  shortURLSlug,
  clickCount,
  onUpdate,
}: URLEntryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSlug, setEditedSlug] = useState(shortURLSlug);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!editedSlug.trim()) {
      setError("Slug cannot be empty");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await updateURLSlug({ data: { id, newSlug: editedSlug } });
      onUpdate(id, editedSlug);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update slug");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedSlug(shortURLSlug);
    setError(null);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isSaving) {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className="bg-slate-700 rounded-lg p-4 hover:bg-slate-650 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="text-sm text-gray-400 mb-1">Short URL</div>

          {isEditing ? (
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{urlsBasePath}</span>
                <input
                  type="text"
                  value={editedSlug}
                  onChange={(e) => setEditedSlug(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-slate-800 text-blue-300 px-2 py-1 rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                  autoFocus
                  disabled={isSaving}
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="bg-slate-600 hover:bg-slate-500 disabled:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-3">
              <a
                href={urlsBasePath + shortURLSlug}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-200 hover:underline"
              >
                {urlsBasePath + shortURLSlug}
              </a>
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-white text-sm underline"
              >
                edit
              </button>
            </div>
          )}

          <div className="text-sm text-gray-400 mb-1">Original URL</div>
          <div className="text-white break-all">{originalURL}</div>
        </div>

        <div className="text-right ml-4">
          <div className="text-2xl font-bold text-blue-400">{clickCount}</div>
          <div className="text-sm text-gray-400">
            {clickCount === 1 ? "click" : "clicks"}
          </div>
        </div>
      </div>
    </div>
  );
}
