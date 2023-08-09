"""handlers/metadata.py

Handle /metadata API endpoint.
"""

from typing import Mapping, Sequence, Dict, Any, Union, List, Optional
from collections import OrderedDict

from terracotta import get_settings, get_driver
from terracotta.profile import trace


@trace("metadata_handler")
def metadata(keys: Union[Sequence[str], Mapping[str, str]]) -> Dict[str, Any]:
    """Returns all metadata for a single dataset"""
    settings = get_settings()
    driver = get_driver(settings.DRIVER_PATH, provider=settings.DRIVER_PROVIDER)
    metadata = driver.get_metadata(keys)
    metadata["keys"] = OrderedDict(zip(driver.key_names, keys))
    return metadata


@trace("multiple_metadata_handler")
def multiple_metadata(keys: Optional[List[str]], datasets: List[List[str]]) -> Dict[str, Any]:
    """Returns all metadata for multiple datasets"""
    settings = get_settings()
    driver = get_driver(settings.DRIVER_PATH, provider=settings.DRIVER_PROVIDER)
    metadata = driver.get_multiple_metadata(set(keys) if keys else None, datasets)
    return metadata
